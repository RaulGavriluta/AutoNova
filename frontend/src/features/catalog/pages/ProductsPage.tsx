import { useState, useEffect } from "react";
import { type Product, type CarVehicle } from "../../../types/catalog.types";
import { productService } from "../../../services/productService";
import { vehicleService } from "../../../services/vehicleService";
import { FiSearch, FiSliders, FiCheck, FiCpu } from "react-icons/fi";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dynamic lists from database
  const [dbVehicles, setDbVehicles] = useState<CarVehicle[]>([]);
  const [vehicleBrands, setVehicleBrands] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  // Standard filter states
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("name-asc");

  // Selected vehicle states
  const [selectedVehicleBrand, setSelectedVehicleBrand] = useState("");
  const [selectedVehicleModel, setSelectedVehicleModel] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchAllCatalogData = async () => {
      try {
        setLoading(true);

        // Fetch products and vehicles in parallel
        const [productsData, vehiclesData] = await Promise.all([
          productService.getProducts(),
          vehicleService.getVehicles(),
        ]);

        setProducts(productsData);
        setFilteredProducts(productsData);
        setDbVehicles(vehiclesData);

        setCategories(Array.from(new Set(productsData.map((p) => p.category))));
        setBrands(Array.from(new Set(productsData.map((p) => p.partBrand))));

        const uniqueVehicleBrands = Array.from(
          new Set(vehiclesData.map((v) => v.brand)),
        );
        setVehicleBrands(uniqueVehicleBrands);
      } catch (err) {
        setError(
          "Failed to fetch the synchronized catalog and vehicle database from Spring Boot.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAllCatalogData();
  }, []);

  // Update available models when vehicle brand is selected
  useEffect(() => {
    if (!selectedVehicleBrand) {
      setAvailableModels([]);
      return;
    }
    // Get unique models for selected brand from database
    const models = dbVehicles
      .filter((v) => v.brand === selectedVehicleBrand)
      .map((v) => v.model);

    setAvailableModels(Array.from(new Set(models)));
  }, [selectedVehicleBrand, dbVehicles]);

  // Main filtering logic
  useEffect(() => {
    let result = [...products];

    if (selectedVehicleBrand) {
      result = result.filter((p) =>
        p.compatibleVehicles?.some(
          (v) => v.brand.toLowerCase() === selectedVehicleBrand.toLowerCase(),
        ),
      );
    }
    if (selectedVehicleModel) {
      result = result.filter((p) =>
        p.compatibleVehicles?.some(
          (v) => v.model.toLowerCase() === selectedVehicleModel.toLowerCase(),
        ),
      );
    }
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query),
      );
    }
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (selectedBrand) {
      result = result.filter((p) => p.partBrand === selectedBrand);
    }
    if (inStockOnly) {
      result = result.filter((p) => p.stockQuantity > 0);
    }

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "name-asc")
      result.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredProducts(result);
  }, [
    search,
    selectedCategory,
    selectedBrand,
    inStockOnly,
    sortBy,
    selectedVehicleBrand,
    selectedVehicleModel,
    products,
  ]);

  const clearVehicleFilter = () => {
    setSelectedVehicleBrand("");
    setSelectedVehicleModel("");
  };

  return (
    <div className="w-full font-body-custom min-h-screen text-text-base py-4 flex flex-col gap-8">
      {/* VEHICLE COMPATIBILITY SELECTOR */}
      <div className="bg-bg-main border border-border-custom p-6 rounded-2xl shadow-sm">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-custom font-bold text-text-base flex items-center gap-2">
              <FiCpu className="text-primary" /> Garage Filter: Select Your
              Vehicle
            </h2>
            <p className="text-text-muted text-xs mt-0.5">
              Show only parts guaranteed to fit your exact model.
            </p>
          </div>
          {(selectedVehicleBrand || selectedVehicleModel) && (
            <button
              onClick={clearVehicleFilter}
              className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
            >
              Reset Vehicle Lock
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={selectedVehicleBrand}
            onChange={(e) => {
              setSelectedVehicleBrand(e.target.value);
              setSelectedVehicleModel("");
            }}
            className="bg-bg-surface border border-border-custom text-text-base rounded-xl p-3 focus:outline-none focus:border-primary transition-colors cursor-pointer text-sm"
          >
            <option value="">All Vehicle Brands</option>
            {vehicleBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            value={selectedVehicleModel}
            onChange={(e) => setSelectedVehicleModel(e.target.value)}
            className="bg-bg-surface border border-border-custom text-text-base rounded-xl p-3 focus:outline-none focus:border-primary transition-colors cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedVehicleBrand}
          >
            <option value="">Select Model</option>
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* HEADER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-border-custom pb-6">
        <div>
          <h1 className="text-2xl font-custom font-bold">
            Available Spare Components
          </h1>
          <p className="text-text-muted text-xs mt-0.5">
            Cross-referenced with internal part numbers.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted pointer-events-none text-lg">
            <FiSearch />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search within selection..."
            className="w-full bg-bg-main border border-border-custom rounded-xl pl-10 pr-4 py-3 text-sm text-text-base focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* MAIN LAYOUT: SIDEBAR + GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden w-full flex items-center justify-center gap-2 bg-bg-main border border-border-custom py-3 rounded-xl font-medium cursor-pointer text-sm"
        >
          <FiSliders /> {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* --- SIDEBAR FILTERS --- */}
        <div
          className={`${showMobileFilters ? "block" : "hidden"} lg:block lg:col-span-1 bg-bg-main border border-border-custom p-6 rounded-2xl h-fit flex flex-col gap-5`}
        >
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Sort Components
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-bg-surface border border-border-custom rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="name-asc">Product Name (A-Z)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-bg-surface border border-border-custom rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Manufacturer
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-bg-surface border border-border-custom rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none text-sm pt-4">
            <div className="relative">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  inStockOnly
                    ? "bg-primary border-primary text-bg-surface"
                    : "bg-bg-surface border-border-custom"
                }`}
              >
                {inStockOnly && <FiCheck className="text-xs stroke-3" />}
              </div>
            </div>
            <span className="font-medium">In Stock Only</span>
          </label>

          {(selectedCategory || selectedBrand || inStockOnly || search) && (
            <button
              onClick={() => {
                setSelectedCategory("");
                setSelectedBrand("");
                setInStockOnly(false);
                setSearch("");
              }}
              className="text-xs text-red-600 font-bold hover:underline text-left mt-2 cursor-pointer pt-2 border-t border-dashed border-border-custom/30"
            >
              Clear Active Sidebar Filters
            </button>
          )}
        </div>

        {/* --- PRODUCTS GRID AREA --- */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {loading && (
            <div className="py-24 text-center text-text-muted font-medium animate-pulse">
              Loading certified mechanical components from Spring Boot...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-24 bg-bg-main/40 border border-dashed border-border-custom rounded-2xl text-text-muted text-sm">
              No parts found matching your specific vehicle compatibility or
              active sidebar filters.
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <>
              <div className="text-xs text-text-muted font-medium">
                Showing {filteredProducts.length} compatible components
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-bg-main border border-border-custom rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all duration-200"
                  >
                    <div className="bg-bg-surface h-44 w-full flex items-center justify-center border-b border-border-custom text-text-muted/40 relative">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-10 h-10"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}

                      <span
                        className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                          product.stockQuantity > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stockQuantity > 0
                          ? `${product.stockQuantity} Available`
                          : "Out of Stock"}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1 gap-3">
                      <div className="flex justify-between items-center text-xs font-bold text-secondary">
                        <span>{product.partBrand.toUpperCase()}</span>
                        <span className="bg-bg-surface px-2 py-0.5 rounded text-text-muted font-normal text-[10px]">
                          {product.category}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-sm font-custom font-bold text-text-base line-clamp-2 min-h-10">
                          {product.name}
                        </h3>
                        <span className="text-[10px] font-mono text-text-muted">
                          SKU: {product.sku}
                        </span>
                      </div>

                      {product.compatibleVehicles &&
                        product.compatibleVehicles.length > 0 && (
                          <div className="text-[10px] text-text-muted flex flex-wrap gap-1 mt-1">
                            <span className="font-bold">Fits:</span>
                            {product.compatibleVehicles.map((v) => (
                              <span
                                key={v.id}
                                className="bg-bg-surface px-1.5 py-0.5 rounded border border-border-custom/50"
                              >
                                {v.brand} {v.model}
                              </span>
                            ))}
                          </div>
                        )}

                      <div className="flex justify-between items-center mt-auto pt-2">
                        <span className="text-base font-bold text-text-base">
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          disabled={product.stockQuantity === 0}
                          className="bg-primary text-bg-main hover:bg-primary-hover disabled:bg-text-muted/20 disabled:text-text-muted/40 text-xs font-semibold py-2 px-3 rounded-lg transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
