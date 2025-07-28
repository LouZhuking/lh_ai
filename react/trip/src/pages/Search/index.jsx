import SearchBox from "@/components/SearchBox"
import useTitle from "@/hooks/useTitle"
import useSearchStore from "@/store/useSearchStore"
import styles from './search.module.css'
import {
  useEffect,
  useState,
  memo
} from 'react'

const HotListItems = memo((props) => {
  console.log('---------HotListItems', props);
  const { hotList } = props
  return (
    <div className={styles.hot}>
      <h1>热门推荐</h1>
      {
        hotList.map((item) => (
          <div key={item.id} className={styles.item}>
            {item.city}
          </div>
        ))
      }
    </div>
  )
})

const Search = () => {
  const {
    hotList,
    setHotList,
    suggestList,
    setSuggestList
  } = useSearchStore()
  useTitle("Search")
  const [query, setQuery] = useState('')

  useEffect(() => {
    setHotList()
  }, [])

  // 单向数据流
  // 反复生成 useCallback 会导致性能问题
  const handleQuery = (query) => {
    // api 请求
    console.log('debounce后', query)
    setQuery(query)
    if (!query) {
      return
    }
    setSuggestList(query)
  }


  const suggestListStyle = {
    display: query === "" ? 'none' : 'block'
  }


  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <SearchBox handleQuery={handleQuery} />
        {/* 维护性 */}
        <HotListItems hotList={hotList} />
        <div className={styles.list} style={suggestListStyle}>
          {
            suggestList.map(item => (
              <div key={item} className={styles.item}>{item}</div>
            ))
          }
        </div>
      </div>
    </div >
  )
}
export default Search