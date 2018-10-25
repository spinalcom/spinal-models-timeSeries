const spinalCore = require("spinal-core-connectorjs");
const globalType = typeof window === "undefined" ? global : window;
import {
  Utilities
} from "../Utilities";

/**
 *
 *
 * @class TimeSeriesData
 * @extends {Model}
 */
class TimeSeriesData extends globalType.Model {
  constructor(argDate, argValue) {
    super();
    if (FileSystem._sig_server) {
      this.add_attr({
        id: Utilities.guid("TimeSeries"),
        date: argDate,
        value: argValue
      });
    }
  }
}


export default TimeSeriesData;
spinalCore.register_models([TimeSeriesData]);