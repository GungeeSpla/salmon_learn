/** isMovable(z1, z2, slipHeight)
 * 行き先のほうが低ければOK
 * 行き先のほうが高くてもその差がslipHeight以内ならOK
 */
const isMovable = (z1, z2, slipHeight) => z1 > z2 || Math.abs(z2 - z1) < slipHeight;

/** ZMap
 */
export default class ZMap {
  /** .constructor(image)
   */
  constructor(image) {
    this.image = image;
    this.width = 640;
    this.height = 960;
  }

  /** .load(image, tryCount)
   */
  load(image, tryCount = 0) {
    return new Promise((resolve) => {
      let $image;
      if (image === undefined) {
        $image = document.createElement('img');
        $image.src = this.image;
      } else {
        $image = image;
      }
      if ($image.naturalWidth === 0) {
        if (tryCount === 0) {
          $image.addEventListener('load', () => {
            resolve(this.load($image, 1));
          }, { once: true });
          return;
        }
        console.log('error!');
        return;
      }
      const $canvas = document.createElement('canvas');
      const width = $image.naturalWidth;
      const height = $image.naturalHeight;
      $canvas.setAttribute('width', width);
      $canvas.setAttribute('height', height);
      this.width = width;
      this.height = height;
      const ctx = $canvas.getContext('2d');
      ctx.drawImage($image, 0, 0, width, height);
      const imagedata = ctx.getImageData(0, 0, width, height);
      const d = imagedata.data;
      const zMap = [];
      let i = 0;
      for (let y = 0; y < height; y += 1) {
        zMap[y] = [];
        for (let x = 0; x < width; x += 1) {
          const r = d[i];
          zMap[y][x] = r;
          i += 4;
        }
      }
      this.zMap = zMap;
      resolve();
    });
  }

  /** .get(x, y)
   */
  get(...args) {
    let [x, y] = args;
    x = Math.max(0, Math.min(this.width - 1, x));
    y = Math.max(0, Math.min(this.height - 1, y));
    return this.zMap[Math.floor(y)][Math.floor(x)];
  }

  /** .getOld(x, y)
   */
  getOld(x, y) {
    if (x >= this.width || y >= this.height || x < 0 || y < 0) {
      return Infinity;
    }
    return this.zMap[Math.floor(y)][Math.floor(x)];
  }

  /** .moveObjectWithZMap($$obj, slipHeight)
   */
  moveObjectWithZMap($$obj, slipHeight) {
    const vxs = Math.sign($$obj.vx);
    const vys = Math.sign($$obj.vy);
    let vx1 = Math.abs(Math.floor($$obj.vx));
    let vx2 = $$obj.vx - vxs * vx1;
    if (vx2 === 0) {
      vx1 -= vxs;
      vx2 = vxs;
    }
    let vy1 = Math.abs(Math.floor($$obj.vy));
    let vy2 = $$obj.vy - vys * vy1;
    if (vy2 === 0) {
      vy1 -= vys;
      vy2 = vys;
    }
    const len = Math.max(vx1 + 1, vy1 + 1);
    // console.log($$obj.vx, vx1, vx2, vxs);
    // console.log($$obj.vy, vy1, vy2, vys);
    let xc = 0;
    let yc = 0;
    let { x } = $$obj;
    let { y } = $$obj;
    const { z } = $$obj;
    const isSetZ = ($$obj.z !== undefined);
    let i;
    let j = 0;
    for (i = 0; i < len; i += 1) {
      let isContinue = false;
      if (i < vx1 + 1) {
        const vx = (i === vx1) ? vx2 : vxs;
        const z1 = (isSetZ) ? z : this.get(x, y);
        const z2 = this.get(x + vx, y);
        if (isMovable(z1, z2, slipHeight)) {
          x += vx;
          isContinue = true;
        } else if (vys !== 0) {
          if (isMovable(z1, this.get(x + vx, y + vys), slipHeight)) {
            y += vys;
            xc += 1;
            j += 0.5;
            if (xc > 1) {
              xc = 0;
              x += vxs;
            }
            isContinue = true;
          }
        }
      }
      if (i < vy1 + 1) {
        const vy = (i === vy1) ? vy2 : vys;
        const z1 = (isSetZ) ? z : this.get(x, y);
        const z2 = this.get(x, y + vy);
        if (isMovable(z1, z2, slipHeight)) {
          y += vy;
          isContinue = true;
        } else if (vxs !== 0) {
          if (isMovable(z1, this.get(x + vxs, y + vy), slipHeight)) {
            x += vxs;
            yc += 1;
            j += 0.5;
            if (yc > 1) {
              yc = 0;
              y += vys;
            }
            isContinue = true;
          }
        }
      }
      if (!isContinue) {
        break;
      }
    }
    $$obj.set(x, y);
    return (i - j) / len;
  }
}
