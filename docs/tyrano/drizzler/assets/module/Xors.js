/** Xors(seed)
 * XOR交換アルゴリズムによる乱数生成機のクラスです。
 */
/** .getRandom(min, max)
 * 整数の乱数を生成します。たとえばgetRandom(0, 10)で0～9の乱数が取得できます。
 * @param {Number} min - 乱数の最小値
 * @param {Number} max - 乱数の最大値+1（この値は取得できない）
 * @return {Number} min以上max未満の整数の乱数
 */
export default class Xors {
  constructor(seed) {
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    this.w = seed || 88675123;
  }
  random() {
    const t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w = (this.w ^ (this.w >> 19)) ^ (t ^ (t >> 8));
    return this.w;
  }
  getRandom(max) {
    return (this.random() % max);
  }
};
