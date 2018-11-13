"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Utilities = require("./Utilities");

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
      this.archiveDataPerDay();
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
      if (typeof value === "undefined") throw "the parameter value is mandatory in addToTimeSeries Method !";

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
        if (t == date) return _this4.data[i];
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
      var d = new Date(dateToRemove).getTime();
      for (var i = 0; i < _this5.data.length; i++) {
        if (_this5.data[i].date.get() == d) {
          var dateRemoved = _this5.data[i];
          _this5.data.splice(i, 1);
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
        var dateArchived = yield _this7.removeDate(dateToArchive[i].date.get());
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
    var _this9 = this;

    var begin = Date.now();
    var end;
    var secondesPerDay = 3600 * this.archiveTime.get();

    setInterval(_asyncToGenerator(function* () {
      end = Date.now();
      yield _this9.archiveDate(begin, end);
      begin = date.now();
    }), secondesPerDay * 1000);
  }

  /**** Cette fonction ne dois pas être utilisée par l'utilisateur */
  formatDate() {
    var t = new Date();
    return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
  }
}
exports.default = TimeSeries;

spinalCore.register_models([TimeSeries]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UaW1lU2VyaWVzLmpzIl0sIm5hbWVzIjpbInNwaW5hbENvcmUiLCJyZXF1aXJlIiwiZ2xvYmFsVHlwZSIsIndpbmRvdyIsImdsb2JhbCIsIlRpbWVTZXJpZXMiLCJNb2RlbCIsImNvbnN0cnVjdG9yIiwiX25hbWUiLCJhcmNoaXZlVGltZSIsImZyZXF1ZW5jeSIsImRhdGEiLCJMc3QiLCJuYW1lIiwiRmlsZVN5c3RlbSIsIl9zaWdfc2VydmVyIiwiYWRkX2F0dHIiLCJpZCIsIlV0aWxpdGllcyIsImd1aWQiLCJhcmNoaXZlIiwiUHRyIiwiYXJjaGl2ZURhdGFQZXJEYXkiLCJhZGRUb1RpbWVTZXJpZXMiLCJ2YWx1ZSIsInRpbWVTIiwiVGltZVNlcmllc0RhdGEiLCJEYXRlIiwibm93IiwicHVzaCIsImdldFRpbWVTZXJpZXNDdXJyZW50VmFsdWUiLCJsZW5ndGgiLCJnZXRUaW1lU2VyaWVzQmV0d2VlbkRhdGVzIiwiYXJnQmVnaW5EYXRlIiwiYXJnRW5kRGF0ZSIsImJlZ2luIiwiZ2V0VGltZSIsImVuZCIsImkiLCJkIiwiZGF0ZVRvTXMiLCJkYXRlIiwiZ2V0IiwiZ2V0RGF0ZVZhbHVlIiwiYXJnRGF0ZSIsInQiLCJyZW1vdmVEYXRlIiwiZGF0ZVRvUmVtb3ZlIiwiZGF0ZVJlbW92ZWQiLCJzcGxpY2UiLCJ1bmRlZmluZWQiLCJhZGREYXRlVG9UaW1lU2VyaWVzQXJjaGl2ZSIsImxvYWQiLCJlbCIsImFyY2hpdmVEYXRlIiwiYmVnaW5EYXRlIiwiZW5kRGF0ZSIsImRhdGVUb0FyY2hpdmUiLCJkYXRlQXJjaGl2ZWQiLCJnZXREYXRlQXJjaGl2ZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInNlY29uZGVzUGVyRGF5Iiwic2V0SW50ZXJ2YWwiLCJmb3JtYXREYXRlIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwicmVnaXN0ZXJfbW9kZWxzIl0s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R21DLGlCQUFpQixJQUpwQjtBQUtEOztBQUVEO0FBQ0FFLGVBQWE7QUFDWCxRQUFJcEIsSUFBSSxJQUFJbEIsSUFBSixFQUFSO0FBQ0EsV0FDRWtCLEVBQUVxQixXQUFGLEtBQ0EsR0FEQSxJQUVDckIsRUFBRXNCLFFBQUYsS0FBZSxDQUZoQixJQUdBLEdBSEEsR0FJQXRCLEVBQUV1QixPQUFGLEVBSkEsR0FLQSxHQUxBLEdBTUF2QixFQUFFd0IsUUFBRixFQU5BLEdBT0EsR0FQQSxHQVFBeEIsRUFBRXlCLFVBQUYsRUFSQSxHQVNBLEdBVEEsR0FVQXpCLEVBQUUwQixVQUFGLEVBWEY7QUFhRDtBQXZOdUM7a0JBeU4zQmxFLFU7O0FBQ2ZMLFdBQVd3RSxlQUFYLENBQTJCLENBQUNuRSxVQUFELENBQTNCIiwiZmlsZSI6IlRpbWVTZXJpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzcGluYWxDb3JlID0gcmVxdWlyZShcInNwaW5hbC1jb3JlLWNvbm5lY3RvcmpzXCIpO1xuY29uc3QgZ2xvYmFsVHlwZSA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB3aW5kb3c7XG5pbXBvcnQge1xuICBVdGlsaXRpZXNcbn0gZnJvbSBcIi4vVXRpbGl0aWVzXCI7XG5cbmltcG9ydCBUaW1lU2VyaWVzRGF0YSBmcm9tIFwiLi9UaW1lU2VyaWVzRGF0YVwiO1xuXG4vKipcbiAqXG4gKlxuICogQGNsYXNzIFRpbWVTZXJpZXNcbiAqIEBleHRlbmRzIHtNb2RlbH1cbiAqL1xuY2xhc3MgVGltZVNlcmllcyBleHRlbmRzIGdsb2JhbFR5cGUuTW9kZWwge1xuICAvKipcbiAgICpDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFRpbWVTZXJpZXMuXG4gICAqSXQgdGFrZXMgYXMgcGFyYW1ldGVycyB0aGUgbmFtZSBvZiB0aGUgdGltZVNlcmllcyAoX25hbWUpIGEgc3RyaW5nLFxuICAgKnRoZSBudW1iZXIgb2YgaG91cnMgZHVyaW5nIHdoaWNoIHRoZSBkYXRhIGlzIHNhdmVkLCBhZnRlciB0aGF0IHRoZSBkYXRhIGlzIGFyY2hpdmVkXG4gICAqYSBmcmVxdWVuY3kgKGZyZXF1ZW5jeSkgb2YgYWRkaW5nIGRhdGEgaW4gc2Vjb25kcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtfbmFtZT1UaW1lU2VyaWVzXSAtIFRpbWVTZXJpZXMgbmFtZVxuICAgKiBAcGFyYW0ge251bWJlcn0gW2FyY2hpdmVUaW1lPTI0XSAtIGluIGhvdXJzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZnJlcXVlbmN5PTVdIC0gaW4gc2Vjb25kXG4gICAqIEBwYXJhbSB7THN0fSBbZGF0YT1uZXcgTHN0KCldIC0gdGltZVNlcmllcyBEYXRhXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBfbmFtZSA9IFwiVGltZVNlcmllc1wiLFxuICAgIGFyY2hpdmVUaW1lID0gMjQsXG4gICAgZnJlcXVlbmN5ID0gNSxcbiAgICBkYXRhID0gbmV3IExzdCgpLFxuICAgIG5hbWUgPSBcIlRpbWVTZXJpZXNcIlxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIGlmIChGaWxlU3lzdGVtLl9zaWdfc2VydmVyKSB7XG4gICAgICB0aGlzLmFkZF9hdHRyKHtcbiAgICAgICAgaWQ6IFV0aWxpdGllcy5ndWlkKHRoaXMuY29uc3RydWN0b3IubmFtZSksXG4gICAgICAgIG5hbWU6IF9uYW1lLFxuICAgICAgICBhcmNoaXZlVGltZTogYXJjaGl2ZVRpbWUsXG4gICAgICAgIGZyZXF1ZW5jeTogZnJlcXVlbmN5LFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBhcmNoaXZlOiBuZXcgUHRyKG5ldyBMc3QoKSlcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hcmNoaXZlRGF0YVBlckRheSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKnRha2VzIGFzIHBhcmFtZXRlciBhIG51bWJlciAoZGF0YSB0byBzYXZlICkgYW5kIHNhdmVzIGFuIG9iamVjdCBvZiB0eXBlIHtkYXRlOiBzYXZlRGF0ZSwgdmFsdWU6IGRhdGFUb1NhdmV9IGluIHRpbWVTZXJpZXMgZGF0YVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBWYWx1ZSBUbyBTYXZlIChtYW5kYXRvcnkpXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBhZGRUb1RpbWVTZXJpZXModmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiKSB0aHJvdyBcInRoZSBwYXJhbWV0ZXIgdmFsdWUgaXMgbWFuZGF0b3J5IGluIGFkZFRvVGltZVNlcmllcyBNZXRob2QgIVwiXG5cbiAgICB2YXIgdGltZVMgPSBuZXcgVGltZVNlcmllc0RhdGEoRGF0ZS5ub3coKSwgdmFsdWUpO1xuICAgIHRoaXMuZGF0YS5wdXNoKHRpbWVTKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSByZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBkYXRlIGFuZCB2YWx1ZSBvZiBjdXJyZW50IHRpbWVTZXJpZXNcbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFzeW5jIGdldFRpbWVTZXJpZXNDdXJyZW50VmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmRhdGEubGVuZ3RoIC0gMV07XG4gIH1cblxuICAvKipcbiAgICpcbiAgICpUYWtlcyBhcyBwYXJhbWV0ZXJzIHR3byBkYXRlcyAoaW4gbWlsbGlzZWNvbmQgb3IgYSBkYXRlIHN0cmluZyBpbiBhIHZhbGlkIGZvcm1hdCwgcHJlZmVyYWJseSBcInllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kc1wiIGZvciBleGFtcGxlIDogMjAxOC0xMC0yNSAxNjoyNjozMCApXG4gICAqYW5kIHJldHVybnMgYSBBcnJheSBvZiBhbGwgdGltZVNlcmllcyBiZXR3ZWVuIHRoZSB0d28gZGF0ZXNcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlfSBhcmdCZWdpbkRhdGUgLSBNdXN0IGJlIGEgZGF0ZSBpbiBtaWxpc2Vjb25kIG9yIGluIHllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kcyBmb3JtYXQgXG4gICAqIEBwYXJhbSB7RGF0ZX0gYXJnRW5kRGF0ZSAtIHRoZSBsYXN0IGRhdGUgaW4gbWlsaXNlY29uZCBvciBpbiB5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHMgZm9ybWF0IFxuICAgKiBAcmV0dXJucyB7QXJyYXl9IEFycmF5IG9mIGFsbCB0aW1lU2VyaWVzIGJldHdlZW4gYXJnQmVnaW5EYXRlIGFuZCBhcmdFbmREYXRlXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBnZXRUaW1lU2VyaWVzQmV0d2VlbkRhdGVzKGFyZ0JlZ2luRGF0ZSwgYXJnRW5kRGF0ZSkge1xuXG4gICAgaWYgKCFhcmdCZWdpbkRhdGUgfHwgIWFyZ0VuZERhdGUpIHRocm93IFwidGhlIHBhcmFtZXRlcnMgYXJnQmVnaW5EYXRlIGFuZCBhcmdFbmREYXRlIGFyZSBtYW5kYXRvcnkgaW4gZ2V0VGltZVNlcmllc0JldHdlZW5EYXRlcyBNZXRob2QgIVwiO1xuXG4gICAgdmFyIHRpbWVTID0gW107XG4gICAgdmFyIGJlZ2luID0gbmV3IERhdGUoYXJnQmVnaW5EYXRlKS5nZXRUaW1lKCk7XG4gICAgdmFyIGVuZCA9IG5ldyBEYXRlKGFyZ0VuZERhdGUpLmdldFRpbWUoKTtcblxuICAgIGlmIChiZWdpbiA+IGVuZCkgYmVnaW4gPSBbZW5kLCAoZW5kID0gYmVnaW4pXVswXTsgLy9zd2FwIGJlZ2luIGFuZCBlbmQgaWYgZW5kIDwgYmVnaW5cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZCA9IHRoaXMuZGF0YVtpXTtcbiAgICAgIHZhciBkYXRlVG9NcyA9IG5ldyBEYXRlKGQuZGF0ZS5nZXQoKSkuZ2V0VGltZSgpO1xuXG4gICAgICBpZiAoZGF0ZVRvTXMgPj0gYmVnaW4gJiYgZGF0ZVRvTXMgPD0gZW5kKSB7XG4gICAgICAgIHRpbWVTLnB1c2goZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRpbWVTO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqSXQgVGFrZXMgYSBkYXRlIGFzIHBhcmFtcyBhbmQgcmV0dXJuIHRoZSBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBkYXRlLFxuICAgKml0IHJldHVybnMgYW4gZW1wdHkgb2JqZWN0IGlmIG5vIGRhdGEgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBkYXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZX0gYXJnRGF0ZSAtIE11c3QgYmUgYSBkYXRlIGluIG1pbGlzZWNvbmQgb3IgaW4geWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzIGZvcm1hdCBcbiAgICogQHJldHVybnMge09iamVjdH0gcmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZGF0ZSBhbmQgZGF0YSBjb3JyZXNwb25kaW5nIHRvIGFyZ0RhdGVcbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFzeW5jIGdldERhdGVWYWx1ZShhcmdEYXRlKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShhcmdEYXRlKS5nZXRUaW1lKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHQgPSBuZXcgRGF0ZSh0aGlzLmRhdGFbaV0uZGF0ZS5nZXQoKSkuZ2V0VGltZSgpO1xuICAgICAgaWYgKHQgPT0gZGF0ZSkgcmV0dXJuIHRoaXMuZGF0YVtpXTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEl0IHRha2VzIGEgZGF0ZSBhcyBhIHBhcmFtcyBhbmQgcmVtb3ZlIGFuZCByZXR1cm5zIHRoZSBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBkYXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZVRvUmVtb3ZlIC0gTXVzdCBiZSBhIGRhdGUgaW4gbWlsaXNlY29uZCBvciBpbiB5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHMgZm9ybWF0IFxuICAgKiBAcmV0dXJucyB7T2JqZWN0fHVuZGVmaW5lZH0gcmV0dXJucyB0aGUgZGF0YSBjb3JyZXNwb25kaW5nIHRvIHRoaXMgZGF0ZSwgcmV0dXJucyB1bmRlZmluZWQgaWYgbm8gZGF0YSBmb3VuZC5cbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFzeW5jIHJlbW92ZURhdGUoZGF0ZVRvUmVtb3ZlKSB7XG4gICAgdmFyIGQgPSBuZXcgRGF0ZShkYXRlVG9SZW1vdmUpLmdldFRpbWUoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMuZGF0YVtpXS5kYXRlLmdldCgpID09IGQpIHtcbiAgICAgICAgdmFyIGRhdGVSZW1vdmVkID0gdGhpcy5kYXRhW2ldO1xuICAgICAgICB0aGlzLmRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICByZXR1cm4gZGF0ZVJlbW92ZWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKioqIEZvbmN0aW9uIG5vbiB1dGlsaXPDqWVzIHBhciBsJ3V0aWxpc2F0ZXVyICovXG4gIGFzeW5jIGFkZERhdGVUb1RpbWVTZXJpZXNBcmNoaXZlKGFyZ0RhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5hcmNoaXZlLmxvYWQoZWwgPT4ge1xuICAgICAgZWwucHVzaChhcmdEYXRlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiB0aGlzIGZ1bmN0aW9uIHRha2VzIGFzIHBhcmFtZXRlcnMgdHdvIGRhdGUgKG9uZSBvcHRpb25hbCksXG4gICAqIGlmIGJvdGggZGF0ZXMgYXJlIGdpdmVuIGl0IGFyY2hpdmVzIGFsbCBkYXRlIGJldHdlZW4gYm90aCAodGhleSBldmVuIGluY2x1ZGVkKVxuICAgKiBlbHNlIGl0IGFyY2hpdmVzIHRoZSBkYXRlIGdpdmVuXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZX0gYmVnaW5EYXRlIC0gTXVzdCBiZSBhIGRhdGUgaW4gbWlsaXNlY29uZCBvciBpbiB5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHMgZm9ybWF0IFxuICAgKiBAcGFyYW0ge0RhdGV9IFtlbmREYXRlPXVuZGVmaW5lZF0gLSBPcHRpb25hbCwgbXVzdCBiZSBhIGRhdGUgaW4gbWlsaXNlY29uZCBvciBpbiB5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHMgZm9ybWF0XG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBhcmNoaXZlRGF0ZShiZWdpbkRhdGUsIGVuZERhdGUgPSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZGF0ZVRvQXJjaGl2ZSA9IFtdO1xuXG4gICAgaWYgKCFlbmREYXRlKSB7XG4gICAgICB2YXIgZCA9IGF3YWl0IHRoaXMuZ2V0RGF0ZVZhbHVlKGJlZ2luRGF0ZSk7XG4gICAgICBkYXRlVG9BcmNoaXZlLnB1c2goZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGVUb0FyY2hpdmUgPSBhd2FpdCB0aGlzLmdldFRpbWVTZXJpZXNCZXR3ZWVuRGF0ZXMoYmVnaW5EYXRlLFxuICAgICAgICBlbmREYXRlKTtcbiAgICB9XG5cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0ZVRvQXJjaGl2ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRhdGVBcmNoaXZlZCA9IGF3YWl0IHRoaXMucmVtb3ZlRGF0ZShkYXRlVG9BcmNoaXZlW2ldLmRhdGUuZ2V0KCkpO1xuICAgICAgaWYgKGRhdGVBcmNoaXZlZCkge1xuICAgICAgICBhd2FpdCB0aGlzLmFkZERhdGVUb1RpbWVTZXJpZXNBcmNoaXZlKGRhdGVBcmNoaXZlZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIHRoaXMgZnVuY3Rpb24gYWxsb3dzIHRvIGdldCBhbGwgZGF0YSBhcmNoaXZlZCwgaXQgcmV0dXJucyBhIFByb21pc2VcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IGEgcHJvbWlzZSBvZiBhbGwgYXJjaGl2ZWQgZGF0YVxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgZ2V0RGF0ZUFyY2hpdmVkKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmFyY2hpdmUubG9hZChlbCA9PiB7XG4gICAgICAgIHJlc29sdmUoZWwpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICp0aGlzIGZ1bmN0aW9uIGFsbG93cyB0byBhcmNoaXZlIHRoZSBkYXRhIG9mIHRoZSB0aW1lU2VyaWVzLCBieSBjaGFuZ2luZyB0aGUgYXR0cmlidXRlIGFyY2hpdmVUaW1lIHlvdSBjaGFuZ2UgdGhlIGFyY2hpdmluZyBmcmVxdWVuY3kuXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhcmNoaXZlRGF0YVBlckRheSgpIHtcbiAgICB2YXIgYmVnaW4gPSBEYXRlLm5vdygpO1xuICAgIHZhciBlbmQ7XG4gICAgdmFyIHNlY29uZGVzUGVyRGF5ID0gMzYwMCAqIHRoaXMuYXJjaGl2ZVRpbWUuZ2V0KCk7XG5cbiAgICBzZXRJbnRlcnZhbChhc3luYyAoKSA9PiB7XG4gICAgICBlbmQgPSBEYXRlLm5vdygpO1xuICAgICAgYXdhaXQgdGhpcy5hcmNoaXZlRGF0ZShiZWdpbiwgZW5kKTtcbiAgICAgIGJlZ2luID0gZGF0ZS5ub3coKTtcbiAgICB9LCBzZWNvbmRlc1BlckRheSAqIDEwMDApO1xuICB9XG5cbiAgLyoqKiogQ2V0dGUgZm9uY3Rpb24gbmUgZG9pcyBwYXMgw6p0cmUgdXRpbGlzw6llIHBhciBsJ3V0aWxpc2F0ZXVyICovXG4gIGZvcm1hdERhdGUoKSB7XG4gICAgdmFyIHQgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiAoXG4gICAgICB0LmdldEZ1bGxZZWFyKCkgK1xuICAgICAgXCItXCIgK1xuICAgICAgKHQuZ2V0TW9udGgoKSArIDEpICtcbiAgICAgIFwiLVwiICtcbiAgICAgIHQuZ2V0RGF0ZSgpICtcbiAgICAgIFwiIFwiICtcbiAgICAgIHQuZ2V0SG91cnMoKSArXG4gICAgICBcIjpcIiArXG4gICAgICB0LmdldE1pbnV0ZXMoKSArXG4gICAgICBcIjpcIiArXG4gICAgICB0LmdldFNlY29uZHMoKVxuICAgICk7XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFRpbWVTZXJpZXM7XG5zcGluYWxDb3JlLnJlZ2lzdGVyX21vZGVscyhbVGltZVNlcmllc10pOyJdfQ==