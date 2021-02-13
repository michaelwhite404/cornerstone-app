/**
 * Turn number into an ordinal string
 *
 * @param {Number} n - Input Number
 */
const ordinal = (n) => {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

module.exports = ordinal;
