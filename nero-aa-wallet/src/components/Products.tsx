import React, { useCallback, useState, useEffect } from 'react'
import AgroABi from "@/constants/agrochain.json";
import { contractAddressAgroChaim } from "@/constants/contractRole";
import { useReadContract } from "wagmi";
import { ProductCard } from "@/components/ProductCard";
import ProductFliter from "@/components/ProductFliter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// import { Loader}

const Products = () => {

    const [productLen, setProductLen] = useState<Map<string, string>>(new Map());

    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("newest");


    const { data: agroProduct } = useReadContract({
        abi: AgroABi,
        address: contractAddressAgroChaim,
        functionName: "productCount",
        args: [],
      })

      console.log(agroProduct, "Agrochain product count");
      
      const getProductLen = useCallback(() => {
        try {
          if (!agroProduct) {
            console.log("agroProduct is undefined or null");
            return;
          }
    
          const newMap = new Map<string, string>();
          if (typeof agroProduct === 'bigint' && agroProduct > 0) {
            for (let i = 0; i < agroProduct; i++) {
              newMap.set(i.toString(), i.toString()); 
            }
            setProductLen(new Map(newMap));
          } else {
            console.log("agroProduct is not a valid bigint:", agroProduct);
          }
        } catch (error) {
          console.error("Error setting employee IDs:", error);
        }
      }, [agroProduct])
    
      useEffect(() => {
        getProductLen()
      }, [agroProduct, getProductLen])

      const handleSearch = (query: string) => {
        setSearchQuery(query)
      }


  return (

    <div>

    <ProductFliter onSearch={handleSearch} />
    <div className="w-full md:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
         {[...productLen.entries()].map(([key, value]) => (
        <ProductCard id={value} key={key} searchQuery={searchQuery} />
      ))}
    </div>
    </div>
  )
}

export default Products