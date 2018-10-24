const spinalCore = require("spinal-core-connectorjs");
const globalType = typeof window === "undefined" ? global : window;
import {
  Utilities
} from "../Utilities";
/**
 *
 *
 * @class TimeSeries
 * @extends {Model}
 */
class TimeSeries extends globalType.Model {
  /**
   *Creates an instance of TimeSeries.
   * @param {string} [_name="TimeSeries"]
   * @param {number} [windowSize=60]
   * @param {number} [frequence=5] - in second
   * @param {Lst} [data=new Lst()]
   * @memberof TimeSeries
   */
  constructor(
    _name = "TimeSeries",
    windowSize = 60,
    frequence = 5, // in s
    data = new Lst(),
    name = "TimeSeries"
  ) {
    super();
    if (FileSystem._sig_server) {
      this.add_attr({
        id: Utilities.guid(this.constructor.name),
        name: _name,
        windowSize: windowSize,
        frequence: frequence,
        data: data,
      });
    }
  }

  addToHistory(value) {
    var timeS = {
      date: this.getDate(),
      value: value
    }

    this.data.push(timeS);

  }

  getDate() {
    var t = new Date();
    return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() +
      " " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds()
  }
}
export default TimeSeries;
spinalCore.register_models([TimeSeries]);