

import React from 'react'
import { Input } from "@/components/ui/input";

interface ProductFliterProps {
  onSearch: (query: string) => void;
}

const ProductFliter = ({onSearch}: ProductFliterProps) => {
  return (
    
        <div className="flex-1">
            <Input
              placeholder="Search products..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full"
            />
          </div>

  )
}

export default ProductFliter