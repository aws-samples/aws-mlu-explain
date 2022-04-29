import {range} from 'd3-array'
export function updateData(k,n) {
  const data = range(0,(k*n),1).map((f)=>{
    const fold = Math.floor(f/n) + 1
    const subFold = (f % (k)) + 1
    const category = () => {
      if (fold === subFold) { return "validate" } else {return 'train'}
    }
      return {
        category:category(),
        fold,
        subFold
    }
  })
  return data
}