import React, { useEffect, useState } from "react";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";

type CategoriesType = {
  [key: string]: {
    [sub: string]: string[];
  };
};

const CATEGORIES: CategoriesType = {
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

const AddProduct: React.FC = () => {
  const navigate = useNavigate();

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [description, setDescription] = useState("");

  const [categoriesMap, setCategoriesMap] = useState<CategoriesType>(CATEGORIES);
  const [category, setCategory] = useState<string>(Object.keys(CATEGORIES)[0]);
  const [subcategory, setSubcategory] = useState<string>("");
  const [subSubcategory, setSubSubcategory] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const [colorName, setColorName] = useState("");
  const [colors, setColors] = useState<{ name: string }[]>([]);

  const [sizeInput, setSizeInput] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);

  // Load dynamic categories tree
  useEffect(() => {
    api.get<any[]>('/categories/tree')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const dynamicCategories: CategoriesType = {};
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
          
          // Re-initialize selections based on retrieved data
          const firstMain = Object.keys(dynamicCategories)[0];
          if (firstMain) {
            setCategory(firstMain);
            const firstSub = Object.keys(dynamicCategories[firstMain] || {})[0];
            if (firstSub) {
              setSubcategory(firstSub);
              const firstChild = dynamicCategories[firstMain][firstSub]?.[0] || "";
              setSubSubcategory(firstChild);
            }
          }
        }
      })
      .catch(err => console.error("Error loading categories tree", err));
  }, []);

  // Preview Images
  useEffect(() => {
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p));
      return urls;
    });
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [imageFiles]);

  // Handle category selection chain
  useEffect(() => {
    const subs = Object.keys(categoriesMap[category] || {});
    setSubcategory(subs[0] || "");
    setSubSubcategory("");
  }, [category, categoriesMap]);

  useEffect(() => {
    const subSubs = (categoriesMap[category] && categoriesMap[category][subcategory]) || [];
    setSubSubcategory(subSubs[0] || "");
  }, [subcategory, category, categoriesMap]);

  const handleMultiImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImageFiles((prev) => [...prev, ...files]);
    e.currentTarget.value = "";
  };

  const removeImageAt = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddColor = () => {
    const name = colorName.trim();
    if (!name) return alert("Enter color name");
    setColors((s) => [...s, { name }]);
    setColorName("");
  };

  const removeColorAt = (index: number) => {
    setColors((s) => s.filter((_, i) => i !== index));
  };

  const addSize = () => {
    const v = sizeInput.trim();
    if (!v) return;
    if (!sizes.includes(v)) setSizes((s) => [...s, v]);
    setSizeInput("");
  };

  const removeSizeAt = (index: number) => {
    setSizes((s) => s.filter((_, i) => i !== index));
  };

  // FIXED SUBMIT FUNCTION
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
  
    if (!imageFiles.length) {
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
      // Convert images to base64
      const base64Promises = imageFiles.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      });
      const base64Images = await Promise.all(base64Promises);

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
        image: base64Images[0],
        images: base64Images
      };

      await api.post('/products', payload);
      toast.success("تمت إضافة المنتج بنجاح");
      navigate("/my-store", { state: { newProduct: true, selectedTab: category } });
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "حدث خطأ أثناء إضافة المنتج";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-white px-6 pt-10 pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <ChevronLeft
          className="w-6 h-6 cursor-pointer text-gray-700"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-lg font-bold mx-auto">ADD NEW PRODUCT</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Upload Images */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">IMAGES</h2>
          <label className="relative border-2 border-dashed border-gray-300 flex flex-col items-center justify-center h-40 overflow-hidden cursor-pointer">
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1829/1829586.png"
                alt="upload"
                className="w-9 h-9 opacity-60"
              />
              <p className="text-gray-500 text-sm text-center">
                UPLOAD PRODUCT IMAGES
                <br />
                <span className="text-xs">PNG, JPG UP TO 5MB — multiple allowed</span>
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

        {/* Product name, price, description */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">DETAILS</h2>
          <input value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full border border-gray-300 px-4 py-3 text-sm mb-3" placeholder="PRODUCT NAME" required />
          <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))} className="w-full border border-gray-300 px-4 py-3 text-sm mb-3" placeholder="PRICE (MRU)" required />
          <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))} className="w-full border border-gray-300 px-4 py-3 text-sm mb-3" placeholder="STOCK (المخزون)" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 px-4 py-3 text-sm h-24 resize-none" placeholder="DESCRIPTION (OPTIONAL)" />
        </div>

        {/* Category select */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">CATEGORY</h2>
          <div className="flex flex-col gap-3">
            <select className="border border-gray-300 px-4 py-3 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
              {Object.keys(categoriesMap).map((cat) => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>

            <select className="border border-gray-300 px-4 py-3 text-sm" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
              {Object.keys(categoriesMap[category] || {}).map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>

            <select className="border border-gray-300 px-4 py-3 text-sm" value={subSubcategory} onChange={(e) => setSubSubcategory(e.target.value)}>
              {(categoriesMap[category] && categoriesMap[category][subcategory])?.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
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
              placeholder="Color name (e.g. Red)" 
              className="flex-1 border border-gray-300 px-3 py-2 text-sm" 
            />
            <button type="button" onClick={handleAddColor} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 text-sm">
              <Plus className="w-4 h-4 inline-block" /> Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-100 px-2 py-1">
                <span className="text-sm">{c.name}</span>
                <button type="button" onClick={() => removeColorAt(i)}>
                  <Trash2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">SIZE</h2>
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
              placeholder="Add size (e.g. M / 42)" 
              className="flex-1 border border-gray-300 px-3 py-2 text-sm" 
            />
            <button type="button" onClick={addSize} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 text-sm">
              <Plus className="w-4 h-4 inline-block" /> Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((s, i) => (
              <div key={i} className="flex items-center gap-2 bg-yellow-300 px-3 py-1.5 text-sm font-semibold">
                <span>{s}</span>
                <button type="button" onClick={() => removeSizeAt(i)}>
                  <Trash2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={submitting} className="w-full bg-black text-white py-3 font-semibold disabled:bg-gray-400">
          {submitting ? "ADDING PRODUCT..." : "ADD NEW"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
