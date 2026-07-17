import React, { useEffect, useState } from "react";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";

const AddOffer: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // multi images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // fields
  const [offerName, setOfferName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [comparePrice, setComparePrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [description, setDescription] = useState("");

  // colors
  const [colorName, setColorName] = useState("");
  const [colors, setColors] = useState<string[]>([]);

  // sizes
  const [sizeInput, setSizeInput] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);

  // create image previews
  useEffect(() => {
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p));
      return urls;
    });
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [imageFiles]);

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
    if (!colors.includes(name)) setColors((prev) => [...prev, name]);
    setColorName("");
  };

  const removeColorAt = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const addSize = () => {
    const v = sizeInput.trim();
    if (!v) return;
    if (!sizes.includes(v)) setSizes((prev) => [...prev, v]);
    setSizeInput("");
  };

  const removeSizeAt = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!offerName || !price || !comparePrice) {
      toast.error("يرجى ملء الحقول المطلوبة (الاسم، السعر، وسعر المقارنة)");
      return;
    }
    if (Number(comparePrice) <= Number(price)) {
      toast.error("سعر المقارنة (القديم) يجب أن يكون أكبر من سعر العرض (الجديد)");
      return;
    }
    if (!imageFiles.length) {
      toast.error("يرجى إضافة صورة واحدة على الأقل");
      return;
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
        name: offerName,
        price: Number(price),
        originalPrice: comparePrice ? Number(comparePrice) : null,
        stock: stock !== "" ? Number(stock) : 0,
        description,
        category: "offers", // backend will resolve this to store's primary category
        subcategory: "dresses", // default fallback
        subSubcategory: "",
        sizes,
        colors: colors.map(c => ({ name: c })),
        image: base64Images[0],
        images: base64Images
      };

      await api.post('/products', payload);
      toast.success("تمت إضافة العرض بنجاح");
      navigate("/my-store", { state: { newProduct: true, selectedTab: "offers" } });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء إضافة العرض");
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
        <h1 className="text-lg font-bold mx-auto">ADD NEW OFFER</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Images */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">IMAGES</h2>
          <label className="relative border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center h-40 overflow-hidden cursor-pointer">
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1829/1829586.png"
                alt="upload"
                className="w-9 h-9 opacity-60"
              />
              <p className="text-gray-500 text-sm text-center">
                UPLOAD OFFER IMAGES
                <br />
                <span className="text-xs">PNG, JPG UP TO 5MB — Multiple allowed</span>
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultiImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>

          {imagePreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative rounded-md overflow-hidden">
                  <img
                    src={src}
                    alt={`img-${i}`}
                    className="w-full h-20 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageAt(i)}
                    className="absolute top-1 right-1 bg-white/80 p-1 rounded"
                  >
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
          <input
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-3 text-sm mb-3"
            placeholder="OFFER NAME"
            required
          />
          <div className="flex gap-3 mb-3 items-stretch">
            <input
              value={price}
              onChange={(e) =>
                setPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
              type="number"
              min={0}
              className="flex-1 border border-gray-300 px-4 py-3 text-sm h-12 w-6"
              placeholder="PRICE"
              required
            />
             <input
              value={comparePrice}
              onChange={(e) =>
                setComparePrice(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              type="number"
              min={0}
              className="flex-1 border border-gray-300 px-4 py-3 text-sm h-12 w-6"
              placeholder="COMPARE (سعر المقارنة)"
              required
            />
          </div>
          <input
            value={stock}
            onChange={(e) =>
              setStock(e.target.value === "" ? "" : Number(e.target.value))
            }
            type="number"
            min={0}
            className="w-full border border-gray-300 px-4 py-3 text-sm mb-3"
            placeholder="STOCK (المخزون)"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 text-sm h-24 resize-none"
            placeholder="DESCRIPTION (OPTIONAL)"
          />
        </div>

        {/* Colors */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">COLORS</h2>
          <div className="flex gap-2 items-center mb-2">
            <input
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="Color name"
              className="flex-1 border border-gray-300  px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 text-sm"
            >
              <Plus className="w-4 h-4 inline-block" /> Add
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1">
                <div className="text-sm font-medium">{c}</div>
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
              placeholder="Add size (e.g. M / 42)"
              className="flex-1 border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={addSize}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 text-sm"
            >
              <Plus className="w-4 h-4 inline-block" /> Add
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {sizes.map((s, i) => (
              <div
                key={s}
                className="flex items-center gap-2 bg-yellow-300 px-3 py-1.5 text-sm font-semibold"
              >
                <span>{s}</span>
                <button type="button" onClick={() => removeSizeAt(i)}>
                  <Trash2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 pb-6">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-3 font-semibold disabled:bg-gray-400"
          >
            {submitting ? "ADDING OFFER..." : "ADD NEW"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOffer;
