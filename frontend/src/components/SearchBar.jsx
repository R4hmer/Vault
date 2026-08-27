function SearchBar({ searchTerm, onSearch }) {
  return (
    <input
      className="search-bar"
      type="text"
      placeholder="Search ideas..."
      value={searchTerm}
      onChange={(event) => onSearch(event.target.value)}
    />
  )
}

export default SearchBar