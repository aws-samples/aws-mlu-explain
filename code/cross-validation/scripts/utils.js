import {range} from 'd3-array'
export function updateData(k) {
  const data = range(0,(k*100),1).map((f)=>{
    const fold = Math.floor(f/100) + 1
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