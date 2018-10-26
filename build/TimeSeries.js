"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Utilities = require("../Utilities");

var _TimeSeriesData = require("./TimeSeriesData");

var _TimeSeriesData2 = _interopRequireDefault(_TimeSeriesData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
   *It takes as parameters the name of the timeSeries (_name) a string,
   *the number of hours during which the data is saved, after that the data is archived
   *a frequency (frequency) of adding data in seconds.
   *
   * @param {string} [_name=TimeSeries] - TimeSeries name
   * @param {number} [archiveTime=24] - in hours
   * @param {number} [frequency=5] - in second
   * @param {Lst} [data=new Lst()] - timeSeries Data
   * @memberof TimeSeries
   */
  constructor(_name = "TimeSeries", archiveTime = 24, frequency = 5, data = new Lst(), name = "TimeSeries") {
    super();
    if (FileSystem._sig_server) {
      this.add_attr({
        id: _Utilities.Utilities.guid(this.constructor.name),
        name: _name,
        archiveTime: archiveTime,
        frequency: frequency,
        data: data,
        archive: new Ptr(new Lst())
      });
    }
  }

  /**
   *
   *takes as parameter a number (data to save ) and saves an object of type {date: saveDate, value: dataToSave} in timeSeries data
   *
   * @param {number} value - Value To Save (mandatory)
   * @memberof TimeSeries
   */
  addToTimeSeries(value) {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!value) throw "the parameter value is mandatory in addToTimeSeries Method !";

      var timeS = new _TimeSeriesData2.default(Date.now(), value);
      _this.data.push(timeS);
    })();
  }

  /**
   *
   *
   * @returns {Object} returns an object that contains the date and value of current timeSeries
   * @memberof TimeSeries
   */
  getTimeSeriesCurrentValue() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return _this2.data[_this2.data.length - 1];
    })();
  }

  /**
   *
   *Takes as parameters two dates (in millisecond or a date string in a valid format, preferably "year-month-day hours:minutes:seconds" for example : 2018-10-25 16:26:30 )
   *and returns a Array of all timeSeries between the two dates
   *
   * @param {Date} argBeginDate - Must be a date in milisecond or in year-month-day hours:minutes:seconds format 
   * @param {Date} argEndDate - the last date in milisecond or in year-month-day hours:minutes:seconds format 
   * @returns {Array} Array of all timeSeries between argBeginDate and argEndDate
   * @memberof TimeSeries
   */
  getTimeSeriesBetweenDates(argBeginDate, argEndDate) {
    var _this3 = this;

    return _asyncToGenerator(function* () {

      if (!argBeginDate || !argEndDate) throw "the parameters argBeginDate and argEndDate are mandatory in getTimeSeriesBetweenDates Method !";

      var timeS = [];
      var begin = new Date(argBeginDate).getTime();
      var end = new Date(argEndDate).getTime();

      if (begin > end) begin = [end, end = begin][0]; //swap begin and end if end < begin

      for (var i = 0; i < _this3.data.length; i++) {
        var d = _this3.data[i];
        var dateToMs = new Date(d.date.get()).getTime();
        if (dateToMs >= begin && dateToMs <= end) {
          timeS.push(d);
        }
      }

      return timeS;
    })();
  }

  /**
   *
   *It Takes a date as params and return the data corresponding to this date,
   *it returns an empty object if no data is associated with the date
   *
   * @param {Date} argDate - Must be a date in milisecond or in year-month-day hours:minutes:seconds format 
   * @returns {Object} returns an object that contains the date and data corresponding to argDate
   *
   * @memberof TimeSeries
   */
  getDateValue(argDate) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      var date = new Date(argDate).getTime();

      for (var i = 0; i < _this4.data.length; i++) {
        var t = new Date(_this4.data[i].date.get()).getTime();
        if (t == date) return _this4.data[i].date;
      }
      return {};
    })();
  }

  /**
   *
   * It takes a date as a params and remove and returns the data corresponding to this date
   *
   * @param {Date} dateToRemove - Must be a date in milisecond or in year-month-day hours:minutes:seconds format 
   * @returns {Object|undefined} returns the data corresponding to this date, returns undefined if no data found.
   * @memberof TimeSeries
   */
  removeDate(dateToRemove) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      var d = new Date(dateToRemove).getDate();

      for (var i = 0; i < _this5.data.length; i++) {
        if (_this5.data[i].date.get() == dateToRemove) {
          var dateRemoved = _this5.data[i];
          _this5.data.splice(i, 0);
          return dateRemoved;
        }
      }

      return undefined;
    })();
  }

  /**** Fonction non utilisées par l'utilisateur */
  addDateToTimeSeriesArchive(argDate) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      return _this6.archive.load(function (el) {
        el.push(argDate);
      });
    })();
  }

  /**
   *
   * this function takes as parameters two date (one optional),
   * if both dates are given it archives all date between both (they even included)
   * else it archives the date given
   *
   * @param {Date} beginDate - Must be a date in milisecond or in year-month-day hours:minutes:seconds format 
   * @param {Date} [endDate=undefined] - Optional, must be a date in milisecond or in year-month-day hours:minutes:seconds format
   * @memberof TimeSeries
   */
  archiveDate(beginDate, endDate = undefined) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      var dateToArchive = [];

      if (!endDate) {
        var d = yield _this7.getDateValue(beginDate);
        dateToArchive.push(d);
      } else {
        dateToArchive = yield _this7.getTimeSeriesBetweenDates(beginDate, endDate);
      }

      for (var i = 0; i < dateToArchive.length; i++) {
        var dateArchived = yield _this7.removeDate(dateToArchive[i]);
        if (dateArchived) {
          yield _this7.addDateToTimeSeriesArchive(dateArchived);
        }
      }
    })();
  }

  /**
   *
   * this function allows to get all data archived, it returns a Promise
   *
   * @returns {Promise} a promise of all archived data
   * @memberof TimeSeries
   */
  getDateArchived() {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        _this8.archive.load(function (el) {
          resolve(el);
        });
      });
    })();
  }

  /**
   *this function allows to archive the data of the timeSeries, by changing the attribute archiveTime you change the archiving frequency.
   * @memberof TimeSeries
   */
  archiveDataPerDay() {
    var begin = Date.now();
    var end;
    var secondesPerDay = 3600 * this.archiveTime.get();

    setInterval(() => {
      end = Date.now();
      this.archiveDate(begin, end);
    }, secondesPerDay * 1000);
  }

  /**** Cette fonction ne dois pas être utilisée par l'utilisateur */
  formatDate() {
    var t = new Date();
    return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
  }
}
exports.default = TimeSeries;

spinalCore.register_models([TimeSeries]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UaW1lU2VyaWVzLmpzIl0sIm5hbWVzIjpbInNwaW5hbENvcmUiLCJyZXF1aXJlIiwiZ2xvYmFsVHlwZSIsIndpbmRvdyIsImdsb2JhbCIsIlRpbWVTZXJpZXMiLCJNb2RlbCIsImNvbnN0cnVjdG9yIiwiX25hbWUiLCJhcmNoaXZlVGltZSIsImZyZXF1ZW5jeSIsImRhdGEiLCJMc3QiLCJuYW1lIiwiRmlsZVN5c3RlbSIsIl9zaWdfc2VydmVyIiwiYWRkX2F0dHIiLCJpZCIsIlV0aWxpdGllcyIsImd1aWQiLCJhcmNoaXZlIiwiUHRyIiwiYWRkVG9UaW1lU2VyaWVzIiwidmFsdWUiLCJ0aW1lUyIsIlRpbWVTZXJpZXNEYXRhIiwiRGF0ZSIsIm5vdyIsInB1c2giLCJnZXRUaW1lU2VyaWVzQ3VycmVudFZhbHVlIiwibGVuZ3RoIiwiZ2V0VGltZVNlcmllc0JldHdlZW5EYXRlcyIsImFyZ0JlZ2luRGF0ZSIsImFyZ0VuZERhdGUiLCJiZWdpbiIsImdldFRpbWUiLCJlbmQiLCJpIiwiZCIsImRhdGVUb01zIiwiZGF0ZSIsImdldCIsImdldERhdGVWYWx1ZSIsImFyZ0RhdGUiLCJ0IiwicmVtb3ZlRGF0ZSIsImRhdGVUb1JlbW92ZSIsImdldERhdGUiLCJkYXRlUmVtb3ZlZCIsInNwbGljZSIsInVuZGVmaW5lZCIsImFkZERhdGVUb1RpbWVTZXJpZXNBcmNoaXZlIiwibG9hZCIsImVsIiwiYXJjaGl2ZURhdGUiLCJiZWdpbkRhdGUiLCJlbmREYXRlIiwiZGF0ZVRvQXJjaGl2ZSIsImRhdGVBcmNoaXZlZCIsImdldERhdGVBcmNoaXZlZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJjaGl2ZURhdGFQZXJEYXkiLCJzZWNvbmRlc1BlckRheSIsInNldEludGVydmFsIiwiZm9ybWF0RGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwicmVnaXN0ZXJfbW9kZWxzIl0s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RixLQUNBLEdBREEsSUFFQ3ZCLEVBQUV3QixRQUFGLEtBQWUsQ0FGaEIsSUFHQSxHQUhBLEdBSUF4QixFQUFFRyxPQUFGLEVBSkEsR0FLQSxHQUxBLEdBTUFILEVBQUV5QixRQUFGLEVBTkEsR0FPQSxHQVBBLEdBUUF6QixFQUFFMEIsVUFBRixFQVJBLEdBU0EsR0FUQSxHQVVBMUIsRUFBRTJCLFVBQUYsRUFYRjtBQWFEO0FBcE51QztrQkFzTjNCbEUsVTs7QUFDZkwsV0FBV3dFLGVBQVgsQ0FBMkIsQ0FBQ25FLFVBQUQsQ0FBM0IiLCJmaWxlIjoiVGltZVNlcmllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHNwaW5hbENvcmUgPSByZXF1aXJlKFwic3BpbmFsLWNvcmUtY29ubmVjdG9yanNcIik7XG5jb25zdCBnbG9iYWxUeXBlID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHdpbmRvdztcbmltcG9ydCB7XG4gIFV0aWxpdGllc1xufSBmcm9tIFwiLi4vVXRpbGl0aWVzXCI7XG5cbmltcG9ydCBUaW1lU2VyaWVzRGF0YSBmcm9tIFwiLi9UaW1lU2VyaWVzRGF0YVwiO1xuXG4vKipcbiAqXG4gKlxuICogQGNsYXNzIFRpbWVTZXJpZXNcbiAqIEBleHRlbmRzIHtNb2RlbH1cbiAqL1xuY2xhc3MgVGltZVNlcmllcyBleHRlbmRzIGdsb2JhbFR5cGUuTW9kZWwge1xuICAvKipcbiAgICpDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFRpbWVTZXJpZXMuXG4gICAqSXQgdGFrZXMgYXMgcGFyYW1ldGVycyB0aGUgbmFtZSBvZiB0aGUgdGltZVNlcmllcyAoX25hbWUpIGEgc3RyaW5nLFxuICAgKnRoZSBudW1iZXIgb2YgaG91cnMgZHVyaW5nIHdoaWNoIHRoZSBkYXRhIGlzIHNhdmVkLCBhZnRlciB0aGF0IHRoZSBkYXRhIGlzIGFyY2hpdmVkXG4gICAqYSBmcmVxdWVuY3kgKGZyZXF1ZW5jeSkgb2YgYWRkaW5nIGRhdGEgaW4gc2Vjb25kcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtfbmFtZT1UaW1lU2VyaWVzXSAtIFRpbWVTZXJpZXMgbmFtZVxuICAgKiBAcGFyYW0ge251bWJlcn0gW2FyY2hpdmVUaW1lPTI0XSAtIGluIGhvdXJzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZnJlcXVlbmN5PTVdIC0gaW4gc2Vjb25kXG4gICAqIEBwYXJhbSB7THN0fSBbZGF0YT1uZXcgTHN0KCldIC0gdGltZVNlcmllcyBEYXRhXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBfbmFtZSA9IFwiVGltZVNlcmllc1wiLFxuICAgIGFyY2hpdmVUaW1lID0gMjQsXG4gICAgZnJlcXVlbmN5ID0gNSxcbiAgICBkYXRhID0gbmV3IExzdCgpLFxuICAgIG5hbWUgPSBcIlRpbWVTZXJpZXNcIlxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIGlmIChGaWxlU3lzdGVtLl9zaWdfc2VydmVyKSB7XG4gICAgICB0aGlzLmFkZF9hdHRyKHtcbiAgICAgICAgaWQ6IFV0aWxpdGllcy5ndWlkKHRoaXMuY29uc3RydWN0b3IubmFtZSksXG4gICAgICAgIG5hbWU6IF9uYW1lLFxuICAgICAgICBhcmNoaXZlVGltZTogYXJjaGl2ZVRpbWUsXG4gICAgICAgIGZyZXF1ZW5jeTogZnJlcXVlbmN5LFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBhcmNoaXZlOiBuZXcgUHRyKG5ldyBMc3QoKSlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKnRha2VzIGFzIHBhcmFtZXRlciBhIG51bWJlciAoZGF0YSB0byBzYXZlICkgYW5kIHNhdmVzIGFuIG9iamVjdCBvZiB0eXBlIHtkYXRlOiBzYXZlRGF0ZSwgdmFsdWU6IGRhdGFUb1NhdmV9IGluIHRpbWVTZXJpZXMgZGF0YVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBWYWx1ZSBUbyBTYXZlIChtYW5kYXRvcnkpXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBhZGRUb1RpbWVTZXJpZXModmFsdWUpIHtcbiAgICBpZiAoIXZhbHVlKSB0aHJvdyBcInRoZSBwYXJhbWV0ZXIgdmFsdWUgaXMgbWFuZGF0b3J5IGluIGFkZFRvVGltZVNlcmllcyBNZXRob2QgIVwiXG5cbiAgICB2YXIgdGltZVMgPSBuZXcgVGltZVNlcmllc0RhdGEoRGF0ZS5ub3coKSwgdmFsdWUpO1xuICAgIHRoaXMuZGF0YS5wdXNoKHRpbWVTKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSByZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBkYXRlIGFuZCB2YWx1ZSBvZiBjdXJyZW50IHRpbWVTZXJpZXNcbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFzeW5jIGdldFRpbWVTZXJpZXNDdXJyZW50VmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmRhdGEubGVuZ3RoIC0gMV07XG4gIH1cblxuICAvKipcbiAgICpcbiAgICpUYWtlcyBhcyBwYXJhbWV0ZXJzIHR3byBkYXRlcyAoaW4gbWlsbGlzZWNvbmQgb3IgYSBkYXRlIHN0cmluZyBpbiBhIHZhbGlkIGZvcm1hdCwgcHJlZmVyYWJseSBcInllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kc1wiIGZvciBleGFtcGxlIDogMjAxOC0xMC0yNSAxNjoyNjozMCApXG4gICAqYW5kIHJldHVybnMgYSBBcnJheSBvZiBhbGwgdGltZVNlcmllcyBiZXR3ZWVuIHRoZSB0d28gZGF0ZXNcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlfSBhcmdCZWdpbkRhdGUgLSBNdXN0IGJlIGEgZGF0ZSBpbiBtaWxpc2Vjb25kIG9yIGluIHllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kcyBmb3JtYXQgXG4gICAqIEBwYXJhbSB7RGF0ZX0gYXJnRW5kRGF0ZSAtIHRoZSBsYXN0IGRhdGUgaW4gbWlsaXNlY29uZCBvciBpbiB5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHMgZm9ybWF0IFxuICAgKiBAcmV0dXJucyB7QXJyYXl9IEFycmF5IG9mIGFsbCB0aW1lU2VyaWVzIGJldHdlZW4gYXJnQmVnaW5EYXRlIGFuZCBhcmdFbmREYXRlXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBnZXRUaW1lU2VyaWVzQmV0d2VlbkRhdGVzKGFyZ0JlZ2luRGF0ZSwgYXJnRW5kRGF0ZSkge1xuXG4gICAgaWYgKCFhcmdCZWdpbkRhdGUgfHwgIWFyZ0VuZERhdGUpIHRocm93IFwidGhlIHBhcmFtZXRlcnMgYXJnQmVnaW5EYXRlIGFuZCBhcmdFbmREYXRlIGFyZSBtYW5kYXRvcnkgaW4gZ2V0VGltZVNlcmllc0JldHdlZW5EYXRlcyBNZXRob2QgIVwiO1xuXG4gICAgdmFyIHRpbWVTID0gW107XG4gICAgdmFyIGJlZ2luID0gbmV3IERhdGUoYXJnQmVnaW5EYXRlKS5nZXRUaW1lKCk7XG4gICAgdmFyIGVuZCA9IG5ldyBEYXRlKGFyZ0VuZERhdGUpLmdldFRpbWUoKTtcblxuICAgIGlmIChiZWdpbiA+IGVuZCkgYmVnaW4gPSBbZW5kLCAoZW5kID0gYmVnaW4pXVswXTsgLy9zd2FwIGJlZ2luIGFuZCBlbmQgaWYgZW5kIDwgYmVnaW5cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZCA9IHRoaXMuZGF0YVtpXTtcbiAgICAgIHZhciBkYXRlVG9NcyA9IG5ldyBEYXRlKGQuZGF0ZS5nZXQoKSkuZ2V0VGltZSgpO1xuICAgICAgaWYgKGRhdGVUb01zID49IGJlZ2luICYmIGRhdGVUb01zIDw9IGVuZCkge1xuICAgICAgICB0aW1lUy5wdXNoKGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aW1lUztcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKkl0IFRha2VzIGEgZGF0ZSBhcyBwYXJhbXMgYW5kIHJldHVybiB0aGUgZGF0YSBjb3JyZXNwb25kaW5nIHRvIHRoaXMgZGF0ZSxcbiAgICppdCByZXR1cm5zIGFuIGVtcHR5IG9iamVjdCBpZiBubyBkYXRhIGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgZGF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RhdGV9IGFyZ0RhdGUgLSBNdXN0IGJlIGEgZGF0ZSBpbiBtaWxpc2Vjb25kIG9yIGluIHllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kcyBmb3JtYXQgXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIGRhdGUgYW5kIGRhdGEgY29ycmVzcG9uZGluZyB0byBhcmdEYXRlXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBnZXREYXRlVmFsdWUoYXJnRGF0ZSkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoYXJnRGF0ZSkuZ2V0VGltZSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0ID0gbmV3IERhdGUodGhpcy5kYXRhW2ldLmRhdGUuZ2V0KCkpLmdldFRpbWUoKTtcbiAgICAgIGlmICh0ID09IGRhdGUpIHJldHVybiB0aGlzLmRhdGFbaV0uZGF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEl0IHRha2VzIGEgZGF0ZSBhcyBhIHBhcmFtcyBhbmQgcmVtb3ZlIGFuZCByZXR1cm5zIHRoZSBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBkYXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZVRvUmVtb3ZlIC0gTXVzdCBiZSBhIGRhdGUgaW4gbWlsaXNlY29uZCBvciBpbiB5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHMgZm9ybWF0IFxuICAgKiBAcmV0dXJucyB7T2JqZWN0fHVuZGVmaW5lZH0gcmV0dXJucyB0aGUgZGF0YSBjb3JyZXNwb25kaW5nIHRvIHRoaXMgZGF0ZSwgcmV0dXJucyB1bmRlZmluZWQgaWYgbm8gZGF0YSBmb3VuZC5cbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFzeW5jIHJlbW92ZURhdGUoZGF0ZVRvUmVtb3ZlKSB7XG4gICAgdmFyIGQgPSBuZXcgRGF0ZShkYXRlVG9SZW1vdmUpLmdldERhdGUoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5kYXRhW2ldLmRhdGUuZ2V0KCkgPT0gZGF0ZVRvUmVtb3ZlKSB7XG4gICAgICAgIHZhciBkYXRlUmVtb3ZlZCA9IHRoaXMuZGF0YVtpXTtcbiAgICAgICAgdGhpcy5kYXRhLnNwbGljZShpLCAwKTtcbiAgICAgICAgcmV0dXJuIGRhdGVSZW1vdmVkO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKioqKiBGb25jdGlvbiBub24gdXRpbGlzw6llcyBwYXIgbCd1dGlsaXNhdGV1ciAqL1xuICBhc3luYyBhZGREYXRlVG9UaW1lU2VyaWVzQXJjaGl2ZShhcmdEYXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuYXJjaGl2ZS5sb2FkKGVsID0+IHtcbiAgICAgIGVsLnB1c2goYXJnRGF0ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogdGhpcyBmdW5jdGlvbiB0YWtlcyBhcyBwYXJhbWV0ZXJzIHR3byBkYXRlIChvbmUgb3B0aW9uYWwpLFxuICAgKiBpZiBib3RoIGRhdGVzIGFyZSBnaXZlbiBpdCBhcmNoaXZlcyBhbGwgZGF0ZSBiZXR3ZWVuIGJvdGggKHRoZXkgZXZlbiBpbmNsdWRlZClcbiAgICogZWxzZSBpdCBhcmNoaXZlcyB0aGUgZGF0ZSBnaXZlblxuICAgKlxuICAgKiBAcGFyYW0ge0RhdGV9IGJlZ2luRGF0ZSAtIE11c3QgYmUgYSBkYXRlIGluIG1pbGlzZWNvbmQgb3IgaW4geWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzIGZvcm1hdCBcbiAgICogQHBhcmFtIHtEYXRlfSBbZW5kRGF0ZT11bmRlZmluZWRdIC0gT3B0aW9uYWwsIG11c3QgYmUgYSBkYXRlIGluIG1pbGlzZWNvbmQgb3IgaW4geWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzIGZvcm1hdFxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgYXJjaGl2ZURhdGUoYmVnaW5EYXRlLCBlbmREYXRlID0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGRhdGVUb0FyY2hpdmUgPSBbXTtcblxuICAgIGlmICghZW5kRGF0ZSkge1xuICAgICAgdmFyIGQgPSBhd2FpdCB0aGlzLmdldERhdGVWYWx1ZShiZWdpbkRhdGUpO1xuICAgICAgZGF0ZVRvQXJjaGl2ZS5wdXNoKGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRlVG9BcmNoaXZlID0gYXdhaXQgdGhpcy5nZXRUaW1lU2VyaWVzQmV0d2VlbkRhdGVzKGJlZ2luRGF0ZSxcbiAgICAgICAgZW5kRGF0ZSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRlVG9BcmNoaXZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGF0ZUFyY2hpdmVkID0gYXdhaXQgdGhpcy5yZW1vdmVEYXRlKGRhdGVUb0FyY2hpdmVbaV0pO1xuICAgICAgaWYgKGRhdGVBcmNoaXZlZCkge1xuICAgICAgICBhd2FpdCB0aGlzLmFkZERhdGVUb1RpbWVTZXJpZXNBcmNoaXZlKGRhdGVBcmNoaXZlZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIHRoaXMgZnVuY3Rpb24gYWxsb3dzIHRvIGdldCBhbGwgZGF0YSBhcmNoaXZlZCwgaXQgcmV0dXJucyBhIFByb21pc2VcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IGEgcHJvbWlzZSBvZiBhbGwgYXJjaGl2ZWQgZGF0YVxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgZ2V0RGF0ZUFyY2hpdmVkKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmFyY2hpdmUubG9hZChlbCA9PiB7XG4gICAgICAgIHJlc29sdmUoZWwpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICp0aGlzIGZ1bmN0aW9uIGFsbG93cyB0byBhcmNoaXZlIHRoZSBkYXRhIG9mIHRoZSB0aW1lU2VyaWVzLCBieSBjaGFuZ2luZyB0aGUgYXR0cmlidXRlIGFyY2hpdmVUaW1lIHlvdSBjaGFuZ2UgdGhlIGFyY2hpdmluZyBmcmVxdWVuY3kuXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhcmNoaXZlRGF0YVBlckRheSgpIHtcbiAgICB2YXIgYmVnaW4gPSBEYXRlLm5vdygpO1xuICAgIHZhciBlbmQ7XG4gICAgdmFyIHNlY29uZGVzUGVyRGF5ID0gMzYwMCAqIHRoaXMuYXJjaGl2ZVRpbWUuZ2V0KCk7XG5cbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBlbmQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5hcmNoaXZlRGF0ZShiZWdpbiwgZW5kKTtcbiAgICB9LCBzZWNvbmRlc1BlckRheSAqIDEwMDApO1xuICB9XG5cbiAgLyoqKiogQ2V0dGUgZm9uY3Rpb24gbmUgZG9pcyBwYXMgw6p0cmUgdXRpbGlzw6llIHBhciBsJ3V0aWxpc2F0ZXVyICovXG4gIGZvcm1hdERhdGUoKSB7XG4gICAgdmFyIHQgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiAoXG4gICAgICB0LmdldEZ1bGxZZWFyKCkgK1xuICAgICAgXCItXCIgK1xuICAgICAgKHQuZ2V0TW9udGgoKSArIDEpICtcbiAgICAgIFwiLVwiICtcbiAgICAgIHQuZ2V0RGF0ZSgpICtcbiAgICAgIFwiIFwiICtcbiAgICAgIHQuZ2V0SG91cnMoKSArXG4gICAgICBcIjpcIiArXG4gICAgICB0LmdldE1pbnV0ZXMoKSArXG4gICAgICBcIjpcIiArXG4gICAgICB0LmdldFNlY29uZHMoKVxuICAgICk7XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFRpbWVTZXJpZXM7XG5zcGluYWxDb3JlLnJlZ2lzdGVyX21vZGVscyhbVGltZVNlcmllc10pOyJdfQ==