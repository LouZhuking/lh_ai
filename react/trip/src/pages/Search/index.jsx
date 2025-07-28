import SearchBox from "@components/SearchBox"
import useTitle from "@/hooks/useTitle"
const Search = () => {
  // 单向数据流
  // 反复生成 useCallback 会导致性能问题
  const handleQuery = useCallback((query) => {
    // api 请求
    console.log(query)
  }, [])
  useTitle("Search")
  return (
    <>
      <SearchBox handleQuery={handleQuery} />
    </>
  )
}
export default Search