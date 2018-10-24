"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Utilities = require("../Utilities");

const spinalCore = require("spinal-core-connectorjs");
const globalType = typeof window === "undefined" ? global : window;

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
  constructor(_name = "TimeSeries", windowSize = 60, frequence = 5, // in s
  data = new Lst(), name = "TimeSeries") {
    super();
    if (FileSystem._sig_server) {
      this.add_attr({
        id: _Utilities.Utilities.guid(this.constructor.name),
        name: _name,
        windowSize: windowSize,
        frequence: frequence,
        data: data
      });
    }
  }

  addToHistory(value) {
    var timeS = {
      date: this.getDate(),
      value: value
    };

    this.data.push(timeS);
  }

  getDate() {
    var t = new Date();
    return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
  }
}
exports.default = TimeSeries;

spinalCore.register_models([TimeSeries]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UaW1lU2VyaWVzLmpzIl0sIm5hbWVzIjpbInNwaW5hbENvcmUiLCJyZXF1aXJlIiwiZ2xvYmFsVHlwZSIsIndpbmRvdyIsImdsb2JhbCIsIlRpbWVTZXJpZXMiLCJNb2RlbCIsImNvbnN0cnVjdG9yIiwiX25hbWUiLCJ3aW5kb3dTaXplIiwiZnJlcXVlbmNlIiwiZGF0YSIsIkxzdCIsIm5hbWUiLCJGaWxlU3lzdGVtIiwiX3NpZ19zZXJ2ZXIiLCJhZGRfYXR0ciIsImlkIiwiVXRpbGl0aWVzIiwiZ3VpZCIsImFkZFRvSGlzdG9yeSIsInZhbHVlIiwidGltZVMiLCJkYXRlIiwiZ2V0RGF0ZSIsInB1c2giLCJ0IiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwicmVnaXN0ZXJfbW9kZWxzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQTs7QUFGQSxNQUFNQSxhQUFhQyxRQUFRLHlCQUFSLENBQW5CO0FBQ0EsTUFBTUMsYUFBYSxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLEdBQWdDQyxNQUFoQyxHQUF5Q0QsTUFBNUQ7O0FBSUE7Ozs7OztBQU1BLE1BQU1FLFVBQU4sU0FBeUJILFdBQVdJLEtBQXBDLENBQTBDO0FBQ3hDOzs7Ozs7OztBQVFBQyxjQUNFQyxRQUFRLFlBRFYsRUFFRUMsYUFBYSxFQUZmLEVBR0VDLFlBQVksQ0FIZCxFQUdpQjtBQUNmQyxTQUFPLElBQUlDLEdBQUosRUFKVCxFQUtFQyxPQUFPLFlBTFQsRUFNRTtBQUNBO0FBQ0EsUUFBSUMsV0FBV0MsV0FBZixFQUE0QjtBQUMxQixXQUFLQyxRQUFMLENBQWM7QUFDWkMsWUFBSUMscUJBQVVDLElBQVYsQ0FBZSxLQUFLWixXQUFMLENBQWlCTSxJQUFoQyxDQURRO0FBRVpBLGNBQU1MLEtBRk07QUFHWkMsb0JBQVlBLFVBSEE7QUFJWkMsbUJBQVdBLFNBSkM7QUFLWkMsY0FBTUE7QUFMTSxPQUFkO0FBT0Q7QUFDRjs7QUFFRFMsZUFBYUMsS0FBYixFQUFvQjtBQUNsQixRQUFJQyxRQUFRO0FBQ1ZDLFlBQU0sS0FBS0MsT0FBTCxFQURJO0FBRVZILGFBQU9BO0FBRkcsS0FBWjs7QUFLQSxTQUFLVixJQUFMLENBQVVjLElBQVYsQ0FBZUgsS0FBZjtBQUVEOztBQUVERSxZQUFVO0FBQ1IsUUFBSUUsSUFBSSxJQUFJQyxJQUFKLEVBQVI7QUFDQSxXQUFPRCxFQUFFRSxXQUFGLEtBQWtCLEdBQWxCLElBQXlCRixFQUFFRyxRQUFGLEtBQWUsQ0FBeEMsSUFBNkMsR0FBN0MsR0FBbURILEVBQUVGLE9BQUYsRUFBbkQsR0FDTCxHQURLLEdBQ0NFLEVBQUVJLFFBQUYsRUFERCxHQUNnQixHQURoQixHQUNzQkosRUFBRUssVUFBRixFQUR0QixHQUN1QyxHQUR2QyxHQUM2Q0wsRUFBRU0sVUFBRixFQURwRDtBQUVEO0FBMUN1QztrQkE0QzNCM0IsVTs7QUFDZkwsV0FBV2lDLGVBQVgsQ0FBMkIsQ0FBQzVCLFVBQUQsQ0FBM0IiLCJmaWxlIjoiVGltZVNlcmllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHNwaW5hbENvcmUgPSByZXF1aXJlKFwic3BpbmFsLWNvcmUtY29ubmVjdG9yanNcIik7XG5jb25zdCBnbG9iYWxUeXBlID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHdpbmRvdztcbmltcG9ydCB7XG4gIFV0aWxpdGllc1xufSBmcm9tIFwiLi4vVXRpbGl0aWVzXCI7XG4vKipcbiAqXG4gKlxuICogQGNsYXNzIFRpbWVTZXJpZXNcbiAqIEBleHRlbmRzIHtNb2RlbH1cbiAqL1xuY2xhc3MgVGltZVNlcmllcyBleHRlbmRzIGdsb2JhbFR5cGUuTW9kZWwge1xuICAvKipcbiAgICpDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFRpbWVTZXJpZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbX25hbWU9XCJUaW1lU2VyaWVzXCJdXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbd2luZG93U2l6ZT02MF1cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtmcmVxdWVuY2U9NV0gLSBpbiBzZWNvbmRcbiAgICogQHBhcmFtIHtMc3R9IFtkYXRhPW5ldyBMc3QoKV1cbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIF9uYW1lID0gXCJUaW1lU2VyaWVzXCIsXG4gICAgd2luZG93U2l6ZSA9IDYwLFxuICAgIGZyZXF1ZW5jZSA9IDUsIC8vIGluIHNcbiAgICBkYXRhID0gbmV3IExzdCgpLFxuICAgIG5hbWUgPSBcIlRpbWVTZXJpZXNcIlxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIGlmIChGaWxlU3lzdGVtLl9zaWdfc2VydmVyKSB7XG4gICAgICB0aGlzLmFkZF9hdHRyKHtcbiAgICAgICAgaWQ6IFV0aWxpdGllcy5ndWlkKHRoaXMuY29uc3RydWN0b3IubmFtZSksXG4gICAgICAgIG5hbWU6IF9uYW1lLFxuICAgICAgICB3aW5kb3dTaXplOiB3aW5kb3dTaXplLFxuICAgICAgICBmcmVxdWVuY2U6IGZyZXF1ZW5jZSxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFkZFRvSGlzdG9yeSh2YWx1ZSkge1xuICAgIHZhciB0aW1lUyA9IHtcbiAgICAgIGRhdGU6IHRoaXMuZ2V0RGF0ZSgpLFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfVxuXG4gICAgdGhpcy5kYXRhLnB1c2godGltZVMpO1xuXG4gIH1cblxuICBnZXREYXRlKCkge1xuICAgIHZhciB0ID0gbmV3IERhdGUoKTtcbiAgICByZXR1cm4gdC5nZXRGdWxsWWVhcigpICsgXCItXCIgKyAodC5nZXRNb250aCgpICsgMSkgKyBcIi1cIiArIHQuZ2V0RGF0ZSgpICtcbiAgICAgIFwiIFwiICsgdC5nZXRIb3VycygpICsgXCI6XCIgKyB0LmdldE1pbnV0ZXMoKSArIFwiOlwiICsgdC5nZXRTZWNvbmRzKClcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgVGltZVNlcmllcztcbnNwaW5hbENvcmUucmVnaXN0ZXJfbW9kZWxzKFtUaW1lU2VyaWVzXSk7Il19