import ReactDOM from 'react-dom'
import React, { useEffect, useRef } from 'react'

const w = 256
const h = 256

function App() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    
    canvas.width = w
    canvas.height = h

    const img = ctx.getImageData(0, 0, w, h)

    const neighborhoods = (x: number, y: number): number => {
      let n = 0
      const get = (x1: number, y1: number): boolean => (
        img.data[(y1 * w + x1) * 4 + 3] === 0xFF
      )
      if (get(x - 1, y - 1)) n++
      if (get(x, y - 1)) n++
      if (get(x + 1, y - 1)) n++
      if (get(x - 1, y)) n++
      if (get(x + 1, y)) n++
      if (get(x - 1, y + 1)) n++
      if (get(x, y + 1)) n++
      if (get(x + 1, y + 1)) n++
      return n
    }

    const draw = (start?: boolean): void => {
      const copy = new Uint8ClampedArray(img.data)
      copy[((Math.floor(Math.random() * h) * w + Math.floor(Math.random() * w)) * 4) + 3] = 0xFF
      ctx.clearRect(0, 0, w, h)
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          const p = (y * w + x) * 4
          let alive = copy[p + 3] === 0xFF
          const n = neighborhoods(x, y)
          if (alive) {
            alive = !(n < 2 || n > 3)
          } else {
            alive = n === 3
          }
          if (start) {
            alive = Math.random() > 0.9
            copy[p] = x * 0xFF / w
          }
          copy[p + 3] = alive ? 0xFF : 0x00
        }
      }
      img.data.set(copy)
      ctx.putImageData(img, 0, 0)
      setTimeout(draw, 25)
    }
    draw(true)
  }, [])

  return (
    <canvas ref={ref} />
  )
}

ReactDOM.render( <App />, document.getElementById('app'))
