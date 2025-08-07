import React from 'react';
import searchIcon from '../../assets/icons/search.svg';

interface SearchProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

const Search: React.FC<SearchProps> = ({ 
  placeholder = "검색어를 입력해주세요.", 
  value, 
  onChange, 
  className = "" 
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
      />
     <img src={searchIcon} alt="search" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    </div>
  )
}

export default Search