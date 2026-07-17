import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";

type ProductType = {
  _id: string;
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
  subcategory?: string;
  subSubcategory?: string;
  description?: string;
  sizes?: string[];
  colors?: { name: string }[];
  image?: string;
  images?: string[];
  isOffer?: boolean;
};

const CATEGORIES = {
  women: {
    dresses: ["maxi", "midi", "mini"],
    shoes: ["sneakers", "sandals", "heels"],
    bags: ["totes", "clutches"],
  },
  men: {
    shirts: ["casual", "formal"],
    shoes: ["sneakers", "loafers"],
    accessories: ["belts", "hats"],
  },
  kids: {
    clothes: ["tops", "bottoms"],
    toys: ["soft", "plastic"],
  },
};

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const product: ProductType | undefined = (location.state as any)?.product;
  const [submitting, setSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  // Refs to store the values loaded from API — re-applied whenever categoriesMap reloads
  const loadedCategoryRef = useRef<string>("");
  const loadedSubcategoryRef = useRef<string>("");
  const loadedSubSubcategoryRef = useRef<string>("");
  // True while the data is freshly loaded and categoriesMap may still be updating
  const preserveLoadedValuesRef = useRef(false);
  // The actual product ID used for saving (either from state or from URL param)
  const [productId, setProductId] = useState<string>(id || "");

  // Form state
  const [categoriesMap, setCategoriesMap] = useState<any>(CATEGORIES);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(Object.keys(CATEGORIES)[0]);
  const [subcategory, setSubcategory] = useState<string>("");
  const [subSubcategory, setSubSubcategory] = useState<string>("");

  useEffect(() => {
    api.get<any[]>('/categories/tree')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const dynamicCategories: any = {};
          res.data.forEach(main => {
            let mainKey = main.name.toLowerCase();
            if (mainKey === 'woman') mainKey = 'women';
            if (mainKey === 'man') mainKey = 'men';
            dynamicCategories[mainKey] = {};
            const subsList = main.subcategories || [];
            subsList.forEach((sub: any) => {
              const subKey = sub.name.toLowerCase();
              const childsList = sub.subcategories || [];
              dynamicCategories[mainKey][subKey] = childsList.map((child: any) => child.name.toLowerCase());
            });
          });
          setCategoriesMap(dynamicCategories);
        }
      })
      .catch(err => console.error("Error loading categories tree", err));
  }, []);
  const [colorName, setColorName] = useState("");
  const [colors, setColors] = useState<{ name: string }[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Initialize form - always fetch fresh from API to ensure colors/sizes are loaded correctly
  useEffect(() => {
    const initializeForm = (prod: any) => {
      setProductId(prod._id || prod.id || id || "");
      setProductName(prod.name || "");
      setPrice(prod.price ?? "");
      setStock(prod.stock ?? "");
      setDescription(prod.description || "");
      
      let mappedCategory = prod.category || Object.keys(CATEGORIES)[0];
      if (mappedCategory.toLowerCase() === "woman") mappedCategory = "women";
      if (mappedCategory.toLowerCase() === "man") mappedCategory = "men";

      const mappedSubcategory = (prod.subcategory || "").toLowerCase();
      const mappedSubSub = (prod.subSubcategory || "").toLowerCase();

      // Store loaded values in refs so the categoriesMap watcher can re-apply them
      loadedCategoryRef.current = mappedCategory;
      loadedSubcategoryRef.current = mappedSubcategory;
      loadedSubSubcategoryRef.current = mappedSubSub;
      preserveLoadedValuesRef.current = true;
      setCategory(mappedCategory);
      setSubcategory(mappedSubcategory);
      setSubSubcategory(mappedSubSub);

      // Colors: .NET returns string[], Node.js may return {name}[]
      const rawColors: any[] = prod.colors || prod.Colors || [];
      console.log("🎨 RAW API response:", JSON.stringify(prod));
      console.log("🎨 rawColors:", rawColors);
      const mappedColors = Array.isArray(rawColors) ? rawColors.map((c: any) => {
        if (!c) return null;
        if (typeof c === "string") return { name: c };
        if (typeof c === "object") return { name: c.name || c.colorName || c.ColorName || "" };
        return null;
      }).filter((c): c is { name: string } => c !== null && c.name !== "") : [];
      console.log("🎨 mappedColors:", mappedColors);
      setColors(mappedColors);

      // Sizes: .NET returns string[]
      const rawSizes: any[] = prod.sizes || prod.Sizes || [];
      console.log("📏 rawSizes:", rawSizes);
      const mappedSizes = Array.isArray(rawSizes) ? rawSizes.map((s: any) => {
        if (!s) return "";
        if (typeof s === "string") return s;
        if (typeof s === "object") return s.name || s.sizeName || s.SizeName || "";
        return "";
      }).filter((s): s is string => s !== "") : [];
      console.log("📏 mappedSizes:", mappedSizes);
      setSizes(mappedSizes);
      
      const imgs = (prod.images && prod.images.length > 0) ? prod.images : (prod.image ? [prod.image] : []);
      setImagePreviews(imgs);
      
      setIsInitialized(true);
    };

    const fetchId = id || product?._id;
    if (fetchId) {
      // Always fetch from API for complete data including colors/sizes
      api.get(`/products/${fetchId}`)
        .then((res) => { initializeForm(res.data); })
        .catch((err) => {
          console.error("Failed to fetch product from API", err);
          if (product) initializeForm(product); // fallback to state
          else toast.error("حدث خطأ أثناء تحميل بيانات المنتج");
        });
    }
  }, [id]);

  // When categoriesMap or category changes, preserve loaded values if still in "loaded" mode
  // or reset if user changed category manually
  useEffect(() => {
    if (!isInitialized) return;
    if (preserveLoadedValuesRef.current) {
      // Re-apply the values we loaded from the API (categoriesMap may have just updated)
      setCategory(loadedCategoryRef.current);
      setSubcategory(loadedSubcategoryRef.current);
      setSubSubcategory(loadedSubSubcategoryRef.current);
      // Keep the flag active until the user manually changes the category
      return;
    }
    // User changed category manually: reset subcategory to first option
    const subs = Object.keys((categoriesMap as any)[category] || {});
    setSubcategory(subs[0] || "");
    setSubSubcategory("");
  }, [category, isInitialized, categoriesMap]);

  useEffect(() => {
    if (!isInitialized) return;
    if (preserveLoadedValuesRef.current) return; // let the above effect handle it
    const subSubs = ((categoriesMap as any)[category] && (categoriesMap as any)[category][subcategory]) || [];
    setSubSubcategory((prev) => (subSubs.includes(prev) ? prev : subSubs[0] || ""));
  }, [subcategory, category, isInitialized, categoriesMap]);

  // handle images
  const handleMultiImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImageFiles((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...urls]);
    e.currentTarget.value = "";
  };

  const removeImageAt = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // handle colors
  const handleAddColor = () => {
    const name = colorName.trim();
    if (!name) return alert("Enter color name");
    setColors((prev) => [...prev, { name }]);
    setColorName("");
  };

  const removeColorAt = (index: number) => setColors((prev) => prev.filter((_, i) => i !== index));

  // handle sizes
  const addSize = () => {
    const v = sizeInput.trim();
    if (!v) return;
    if (!sizes.includes(v)) setSizes((prev) => [...prev, v]);
    setSizeInput("");
  };

  const removeSizeAt = (index: number) => setSizes((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const currentId = productId || product?._id || id;
    if (!currentId) return navigate(-1);

    if (!imagePreviews.length) {
      toast.error("يرجى إضافة صورة واحدة على الأقل");
      return;
    }

    // Auto-add any typed values that weren't explicitly added via the "+ Add" button
    let finalColors = [...colors];
    if (colorName.trim()) {
      const trimmedColor = colorName.trim();
      if (!finalColors.some(c => c.name.toLowerCase() === trimmedColor.toLowerCase())) {
        finalColors.push({ name: trimmedColor });
      }
    }

    let finalSizes = [...sizes];
    if (sizeInput.trim()) {
      const trimmedSize = sizeInput.trim();
      if (!finalSizes.some(s => s.toLowerCase() === trimmedSize.toLowerCase())) {
        finalSizes.push(trimmedSize);
      }
    }

    setSubmitting(true);
    try {
      // Convert blob preview URLs to base64
      const convertedPreviews = await Promise.all(
        imagePreviews.map(async (src) => {
          if (src.startsWith("blob:")) {
            const res = await fetch(src);
            const blob = await res.blob();
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => resolve(reader.result as string);
            });
          }
          return src;
        })
      );

      const payload = {
        name: productName,
        price: Number(price),
        stock: Number(stock),
        description,
        category,
        subcategory,
        subSubcategory,
        sizes: finalSizes,
        colors: finalColors,
        image: convertedPreviews[0] || "",
        images: convertedPreviews
      };

      await api.put(`/products/${currentId}`, payload);
      toast.success("تم تعديل المنتج بنجاح");
      navigate("/my-store", { state: { updatedProduct: true, selectedTab: category } });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء تعديل المنتج");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-10 pb-24 max-w-md mx-auto">
      <div className="flex items-center mb-8">
        <ChevronLeft
          className="w-6 h-6 cursor-pointer text-gray-700"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-lg font-bold mx-auto">EDIT PRODUCT</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Images */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">IMAGES</h2>
          <label className="relative border-2 border-dashed border-gray-300 flex flex-col items-center justify-center h-40 overflow-hidden cursor-pointer">
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <img src="https://cdn-icons-png.flaticon.com/512/1829/1829586.png" alt="upload" className="w-9 h-9 opacity-60" />
              <p className="text-gray-500 text-sm text-center">
                UPLOAD PRODUCT IMAGES
                <br />
                <span className="text-xs">PNG, JPG UP TO 5MB — Multiple allowed</span>
              </p>
            </div>
            <input type="file" accept="image/*" multiple onChange={handleMultiImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </label>

          {imagePreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative rounded-md overflow-hidden">
                  <img src={src} alt={`img-${i}`} className="w-full h-20 object-cover" />
                  <button type="button" onClick={() => removeImageAt(i)} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full shadow">
                    <Trash2 className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">DETAILS</h2>
          <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="PRODUCT NAME" className="w-full border border-gray-300 px-4 py-3 text-sm mb-3" required />
          <input value={price} onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))} type="number" min={0} placeholder="PRICE" className="w-full border border-gray-300 px-4 py-3 text-sm mb-3" required />
          <input value={stock} onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))} type="number" min={0} placeholder="STOCK (المخزون)" className="w-full border border-gray-300 px-4 py-3 text-sm mb-3" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="DESCRIPTION (OPTIONAL)" className="w-full border border-gray-300 px-4 py-3 text-sm h-24 resize-none" />
        </div>

        {/* Category */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">CATEGORY</h2>
          <select
            value={category}
            onChange={(e) => {
              preserveLoadedValuesRef.current = false; // user is manually changing
              setCategory(e.target.value);
            }}
            className="border border-gray-300 px-4 py-3 text-sm mb-2"
          >
            {Object.keys(categoriesMap).map((cat) => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
          </select>
          <select
            value={subcategory}
            onChange={(e) => {
              preserveLoadedValuesRef.current = false; // user is manually changing
              setSubcategory(e.target.value);
            }}
            className="border border-gray-300 px-4 py-3 text-sm mb-2"
          >
            {Object.keys((categoriesMap as any)[category] || {}).map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select value={subSubcategory} onChange={(e) => setSubSubcategory(e.target.value)} className="border border-gray-300 px-4 py-3 text-sm mb-2">
            {(((categoriesMap as any)[category] && (categoriesMap as any)[category][subcategory]) || []).map((s: string) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        {/* Colors */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">COLORS</h2>
          <div className="flex gap-2 items-center mb-2">
            <input 
              value={colorName} 
              onChange={(e) => setColorName(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddColor();
                }
              }}
              placeholder="Color name" 
              className="flex-1 border border-gray-300 px-3 py-2 text-sm" 
            />
            <button type="button" onClick={handleAddColor} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 text-sm">
              <Plus className="w-4 h-4 inline-block" /> Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-100 px-2 py-1">
                <span>{c.name}</span>
                <button type="button" onClick={() => removeColorAt(i)}>
                  <Trash2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">SIZES</h2>
          <div className="flex items-center gap-2 mb-2">
            <input 
              value={sizeInput} 
              onChange={(e) => setSizeInput(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSize();
                }
              }}
              placeholder="Add size" 
              className="flex-1 border border-gray-300 px-3 py-2 text-sm" 
            />
            <button type="button" onClick={addSize} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 text-sm">
              <Plus className="w-4 h-4 inline-block" /> Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((s, i) => (
              <div key={s + i} className="flex items-center gap-2 bg-yellow-300 px-3 py-1.5 text-sm font-semibold">
                <span>{s}</span>
                <button type="button" onClick={() => removeSizeAt(i)}>
                  <Trash2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 pb-6">
          <button type="submit" disabled={submitting} className="w-full bg-black text-white py-3 font-semibold disabled:bg-gray-400">
            {submitting ? "SAVING CHANGES..." : "SAVE CHANGES"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
