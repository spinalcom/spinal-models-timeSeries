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
      // begin = date.now();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UaW1lU2VyaWVzLmpzIl0sIm5hbWVzIjpbInNwaW5hbENvcmUiLCJyZXF1aXJlIiwiZ2xvYmFsVHlwZSIsIndpbmRvdyIsImdsb2JhbCIsIlRpbWVTZXJpZXMiLCJNb2RlbCIsImNvbnN0cnVjdG9yIiwiX25hbWUiLCJhcmNoaXZlVGltZSIsImZyZXF1ZW5jeSIsImRhdGEiLCJMc3QiLCJuYW1lIiwiRmlsZVN5c3RlbSIsIl9zaWdfc2VydmVyIiwiYWRkX2F0dHIiLCJpZCIsIlV0aWxpdGllcyIsImd1aWQiLCJhcmNoaXZlIiwiUHRyIiwiYXJjaGl2ZURhdGFQZXJEYXkiLCJhZGRUb1RpbWVTZXJpZXMiLCJ2YWx1ZSIsInRpbWVTIiwiVGltZVNlcmllc0RhdGEiLCJEYXRlIiwibm93IiwicHVzaCIsImdldFRpbWVTZXJpZXNDdXJyZW50VmFsdWUiLCJsZW5ndGgiLCJnZXRUaW1lU2VyaWVzQmV0d2VlbkRhdGVzIiwiYXJnQmVnaW5EYXRlIiwiYXJnRW5kRGF0ZSIsImJlZ2luIiwiZ2V0VGltZSIsImVuZCIsImkiLCJkIiwiZGF0ZVRvTXMiLCJkYXRlIiwiZ2V0IiwiZ2V0RGF0ZVZhbHVlIiwiYXJnRGF0ZSIsInQiLCJyZW1vdmVEYXRlIiwiZGF0ZVRvUmVtb3ZlIiwiZGF0ZVJlbW92ZWQiLCJzcGxpY2UiLCJ1bmRlZmluZWQiLCJhZGREYXRlVG9UaW1lU2VyaWVzQXJjaGl2ZSIsImxvYWQiLCJlbCIsImFyY2hpdmVEYXRlIiwiYmVnaW5EYXRlIiwiZW5kRGF0ZSIsImRhdGVUb0FyY2hpdmUiLCJkYXRlQXJjaGl2ZWQiLCJnZXREYXRlQXJjaGl2ZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInNlY29uZGVzUGVyRGF5Iiwic2V0SW50ZXJ2YWwiLCJmb3JtYXREYXRlIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwicmVnaXN0ZXJfbW9kZWxzIl0s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QUFFRDtBQUNBRSxlQUFhO0FBQ1gsUUFBSXBCLElBQUksSUFBSWxCLElBQUosRUFBUjtBQUNBLFdBQ0VrQixFQUFFcUIsV0FBRixLQUNBLEdBREEsSUFFQ3JCLEVBQUVzQixRQUFGLEtBQWUsQ0FGaEIsSUFHQSxHQUhBLEdBSUF0QixFQUFFdUIsT0FBRixFQUpBLEdBS0EsR0FMQSxHQU1BdkIsRUFBRXdCLFFBQUYsRUFOQSxHQU9BLEdBUEEsR0FRQXhCLEVBQUV5QixVQUFGLEVBUkEsR0FTQSxHQVRBLEdBVUF6QixFQUFFMEIsVUFBRixFQVhGO0FBYUQ7QUF2TnVDO2tCQXlOM0JsRSxVOztBQUNmTCxXQUFXd0UsZUFBWCxDQUEyQixDQUFDbkUsVUFBRCxDQUEzQiIsImZpbGUiOiJUaW1lU2VyaWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc3BpbmFsQ29yZSA9IHJlcXVpcmUoXCJzcGluYWwtY29yZS1jb25uZWN0b3Jqc1wiKTtcbmNvbnN0IGdsb2JhbFR5cGUgPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogd2luZG93O1xuaW1wb3J0IHtcbiAgVXRpbGl0aWVzXG59IGZyb20gXCIuL1V0aWxpdGllc1wiO1xuXG5pbXBvcnQgVGltZVNlcmllc0RhdGEgZnJvbSBcIi4vVGltZVNlcmllc0RhdGFcIjtcblxuLyoqXG4gKlxuICpcbiAqIEBjbGFzcyBUaW1lU2VyaWVzXG4gKiBAZXh0ZW5kcyB7TW9kZWx9XG4gKi9cbmNsYXNzIFRpbWVTZXJpZXMgZXh0ZW5kcyBnbG9iYWxUeXBlLk1vZGVsIHtcbiAgLyoqXG4gICAqQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBUaW1lU2VyaWVzLlxuICAgKkl0IHRha2VzIGFzIHBhcmFtZXRlcnMgdGhlIG5hbWUgb2YgdGhlIHRpbWVTZXJpZXMgKF9uYW1lKSBhIHN0cmluZyxcbiAgICp0aGUgbnVtYmVyIG9mIGhvdXJzIGR1cmluZyB3aGljaCB0aGUgZGF0YSBpcyBzYXZlZCwgYWZ0ZXIgdGhhdCB0aGUgZGF0YSBpcyBhcmNoaXZlZFxuICAgKmEgZnJlcXVlbmN5IChmcmVxdWVuY3kpIG9mIGFkZGluZyBkYXRhIGluIHNlY29uZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbX25hbWU9VGltZVNlcmllc10gLSBUaW1lU2VyaWVzIG5hbWVcbiAgICogQHBhcmFtIHtudW1iZXJ9IFthcmNoaXZlVGltZT0yNF0gLSBpbiBob3Vyc1xuICAgKiBAcGFyYW0ge251bWJlcn0gW2ZyZXF1ZW5jeT01XSAtIGluIHNlY29uZFxuICAgKiBAcGFyYW0ge0xzdH0gW2RhdGE9bmV3IExzdCgpXSAtIHRpbWVTZXJpZXMgRGF0YVxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgX25hbWUgPSBcIlRpbWVTZXJpZXNcIixcbiAgICBhcmNoaXZlVGltZSA9IDI0LFxuICAgIGZyZXF1ZW5jeSA9IDUsXG4gICAgZGF0YSA9IG5ldyBMc3QoKSxcbiAgICBuYW1lID0gXCJUaW1lU2VyaWVzXCJcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICBpZiAoRmlsZVN5c3RlbS5fc2lnX3NlcnZlcikge1xuICAgICAgdGhpcy5hZGRfYXR0cih7XG4gICAgICAgIGlkOiBVdGlsaXRpZXMuZ3VpZCh0aGlzLmNvbnN0cnVjdG9yLm5hbWUpLFxuICAgICAgICBuYW1lOiBfbmFtZSxcbiAgICAgICAgYXJjaGl2ZVRpbWU6IGFyY2hpdmVUaW1lLFxuICAgICAgICBmcmVxdWVuY3k6IGZyZXF1ZW5jeSxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgYXJjaGl2ZTogbmV3IFB0cihuZXcgTHN0KCkpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuYXJjaGl2ZURhdGFQZXJEYXkoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICp0YWtlcyBhcyBwYXJhbWV0ZXIgYSBudW1iZXIgKGRhdGEgdG8gc2F2ZSApIGFuZCBzYXZlcyBhbiBvYmplY3Qgb2YgdHlwZSB7ZGF0ZTogc2F2ZURhdGUsIHZhbHVlOiBkYXRhVG9TYXZlfSBpbiB0aW1lU2VyaWVzIGRhdGFcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gVmFsdWUgVG8gU2F2ZSAobWFuZGF0b3J5KVxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgYWRkVG9UaW1lU2VyaWVzKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikgdGhyb3cgXCJ0aGUgcGFyYW1ldGVyIHZhbHVlIGlzIG1hbmRhdG9yeSBpbiBhZGRUb1RpbWVTZXJpZXMgTWV0aG9kICFcIlxuXG4gICAgdmFyIHRpbWVTID0gbmV3IFRpbWVTZXJpZXNEYXRhKERhdGUubm93KCksIHZhbHVlKTtcbiAgICB0aGlzLmRhdGEucHVzaCh0aW1lUyk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gcmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZGF0ZSBhbmQgdmFsdWUgb2YgY3VycmVudCB0aW1lU2VyaWVzXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBnZXRUaW1lU2VyaWVzQ3VycmVudFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqVGFrZXMgYXMgcGFyYW1ldGVycyB0d28gZGF0ZXMgKGluIG1pbGxpc2Vjb25kIG9yIGEgZGF0ZSBzdHJpbmcgaW4gYSB2YWxpZCBmb3JtYXQsIHByZWZlcmFibHkgXCJ5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHNcIiBmb3IgZXhhbXBsZSA6IDIwMTgtMTAtMjUgMTY6MjY6MzAgKVxuICAgKmFuZCByZXR1cm5zIGEgQXJyYXkgb2YgYWxsIHRpbWVTZXJpZXMgYmV0d2VlbiB0aGUgdHdvIGRhdGVzXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZX0gYXJnQmVnaW5EYXRlIC0gTXVzdCBiZSBhIGRhdGUgaW4gbWlsaXNlY29uZCBvciBpbiB5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHMgZm9ybWF0IFxuICAgKiBAcGFyYW0ge0RhdGV9IGFyZ0VuZERhdGUgLSB0aGUgbGFzdCBkYXRlIGluIG1pbGlzZWNvbmQgb3IgaW4geWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzIGZvcm1hdCBcbiAgICogQHJldHVybnMge0FycmF5fSBBcnJheSBvZiBhbGwgdGltZVNlcmllcyBiZXR3ZWVuIGFyZ0JlZ2luRGF0ZSBhbmQgYXJnRW5kRGF0ZVxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgZ2V0VGltZVNlcmllc0JldHdlZW5EYXRlcyhhcmdCZWdpbkRhdGUsIGFyZ0VuZERhdGUpIHtcblxuICAgIGlmICghYXJnQmVnaW5EYXRlIHx8ICFhcmdFbmREYXRlKSB0aHJvdyBcInRoZSBwYXJhbWV0ZXJzIGFyZ0JlZ2luRGF0ZSBhbmQgYXJnRW5kRGF0ZSBhcmUgbWFuZGF0b3J5IGluIGdldFRpbWVTZXJpZXNCZXR3ZWVuRGF0ZXMgTWV0aG9kICFcIjtcblxuICAgIHZhciB0aW1lUyA9IFtdO1xuICAgIHZhciBiZWdpbiA9IG5ldyBEYXRlKGFyZ0JlZ2luRGF0ZSkuZ2V0VGltZSgpO1xuICAgIHZhciBlbmQgPSBuZXcgRGF0ZShhcmdFbmREYXRlKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAoYmVnaW4gPiBlbmQpIGJlZ2luID0gW2VuZCwgKGVuZCA9IGJlZ2luKV1bMF07IC8vc3dhcCBiZWdpbiBhbmQgZW5kIGlmIGVuZCA8IGJlZ2luXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGQgPSB0aGlzLmRhdGFbaV07XG4gICAgICB2YXIgZGF0ZVRvTXMgPSBuZXcgRGF0ZShkLmRhdGUuZ2V0KCkpLmdldFRpbWUoKTtcblxuICAgICAgaWYgKGRhdGVUb01zID49IGJlZ2luICYmIGRhdGVUb01zIDw9IGVuZCkge1xuICAgICAgICB0aW1lUy5wdXNoKGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aW1lUztcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKkl0IFRha2VzIGEgZGF0ZSBhcyBwYXJhbXMgYW5kIHJldHVybiB0aGUgZGF0YSBjb3JyZXNwb25kaW5nIHRvIHRoaXMgZGF0ZSxcbiAgICppdCByZXR1cm5zIGFuIGVtcHR5IG9iamVjdCBpZiBubyBkYXRhIGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgZGF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RhdGV9IGFyZ0RhdGUgLSBNdXN0IGJlIGEgZGF0ZSBpbiBtaWxpc2Vjb25kIG9yIGluIHllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kcyBmb3JtYXQgXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIGRhdGUgYW5kIGRhdGEgY29ycmVzcG9uZGluZyB0byBhcmdEYXRlXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBnZXREYXRlVmFsdWUoYXJnRGF0ZSkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoYXJnRGF0ZSkuZ2V0VGltZSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0ID0gbmV3IERhdGUodGhpcy5kYXRhW2ldLmRhdGUuZ2V0KCkpLmdldFRpbWUoKTtcbiAgICAgIGlmICh0ID09IGRhdGUpIHJldHVybiB0aGlzLmRhdGFbaV07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBJdCB0YWtlcyBhIGRhdGUgYXMgYSBwYXJhbXMgYW5kIHJlbW92ZSBhbmQgcmV0dXJucyB0aGUgZGF0YSBjb3JyZXNwb25kaW5nIHRvIHRoaXMgZGF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVUb1JlbW92ZSAtIE11c3QgYmUgYSBkYXRlIGluIG1pbGlzZWNvbmQgb3IgaW4geWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzIGZvcm1hdCBcbiAgICogQHJldHVybnMge09iamVjdHx1bmRlZmluZWR9IHJldHVybnMgdGhlIGRhdGEgY29ycmVzcG9uZGluZyB0byB0aGlzIGRhdGUsIHJldHVybnMgdW5kZWZpbmVkIGlmIG5vIGRhdGEgZm91bmQuXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyByZW1vdmVEYXRlKGRhdGVUb1JlbW92ZSkge1xuICAgIHZhciBkID0gbmV3IERhdGUoZGF0ZVRvUmVtb3ZlKS5nZXRUaW1lKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmRhdGFbaV0uZGF0ZS5nZXQoKSA9PSBkKSB7XG4gICAgICAgIHZhciBkYXRlUmVtb3ZlZCA9IHRoaXMuZGF0YVtpXTtcbiAgICAgICAgdGhpcy5kYXRhLnNwbGljZShpLCAxKTtcbiAgICAgICAgcmV0dXJuIGRhdGVSZW1vdmVkO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKioqKiBGb25jdGlvbiBub24gdXRpbGlzw6llcyBwYXIgbCd1dGlsaXNhdGV1ciAqL1xuICBhc3luYyBhZGREYXRlVG9UaW1lU2VyaWVzQXJjaGl2ZShhcmdEYXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuYXJjaGl2ZS5sb2FkKGVsID0+IHtcbiAgICAgIGVsLnB1c2goYXJnRGF0ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogdGhpcyBmdW5jdGlvbiB0YWtlcyBhcyBwYXJhbWV0ZXJzIHR3byBkYXRlIChvbmUgb3B0aW9uYWwpLFxuICAgKiBpZiBib3RoIGRhdGVzIGFyZSBnaXZlbiBpdCBhcmNoaXZlcyBhbGwgZGF0ZSBiZXR3ZWVuIGJvdGggKHRoZXkgZXZlbiBpbmNsdWRlZClcbiAgICogZWxzZSBpdCBhcmNoaXZlcyB0aGUgZGF0ZSBnaXZlblxuICAgKlxuICAgKiBAcGFyYW0ge0RhdGV9IGJlZ2luRGF0ZSAtIE11c3QgYmUgYSBkYXRlIGluIG1pbGlzZWNvbmQgb3IgaW4geWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzIGZvcm1hdCBcbiAgICogQHBhcmFtIHtEYXRlfSBbZW5kRGF0ZT11bmRlZmluZWRdIC0gT3B0aW9uYWwsIG11c3QgYmUgYSBkYXRlIGluIG1pbGlzZWNvbmQgb3IgaW4geWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzIGZvcm1hdFxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgYXJjaGl2ZURhdGUoYmVnaW5EYXRlLCBlbmREYXRlID0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGRhdGVUb0FyY2hpdmUgPSBbXTtcblxuICAgIGlmICghZW5kRGF0ZSkge1xuICAgICAgdmFyIGQgPSBhd2FpdCB0aGlzLmdldERhdGVWYWx1ZShiZWdpbkRhdGUpO1xuICAgICAgZGF0ZVRvQXJjaGl2ZS5wdXNoKGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRlVG9BcmNoaXZlID0gYXdhaXQgdGhpcy5nZXRUaW1lU2VyaWVzQmV0d2VlbkRhdGVzKGJlZ2luRGF0ZSxcbiAgICAgICAgZW5kRGF0ZSk7XG4gICAgfVxuXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGVUb0FyY2hpdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkYXRlQXJjaGl2ZWQgPSBhd2FpdCB0aGlzLnJlbW92ZURhdGUoZGF0ZVRvQXJjaGl2ZVtpXS5kYXRlLmdldCgpKTtcbiAgICAgIGlmIChkYXRlQXJjaGl2ZWQpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hZGREYXRlVG9UaW1lU2VyaWVzQXJjaGl2ZShkYXRlQXJjaGl2ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiB0aGlzIGZ1bmN0aW9uIGFsbG93cyB0byBnZXQgYWxsIGRhdGEgYXJjaGl2ZWQsIGl0IHJldHVybnMgYSBQcm9taXNlXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBhIHByb21pc2Ugb2YgYWxsIGFyY2hpdmVkIGRhdGFcbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFzeW5jIGdldERhdGVBcmNoaXZlZCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5hcmNoaXZlLmxvYWQoZWwgPT4ge1xuICAgICAgICByZXNvbHZlKGVsKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqdGhpcyBmdW5jdGlvbiBhbGxvd3MgdG8gYXJjaGl2ZSB0aGUgZGF0YSBvZiB0aGUgdGltZVNlcmllcywgYnkgY2hhbmdpbmcgdGhlIGF0dHJpYnV0ZSBhcmNoaXZlVGltZSB5b3UgY2hhbmdlIHRoZSBhcmNoaXZpbmcgZnJlcXVlbmN5LlxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXJjaGl2ZURhdGFQZXJEYXkoKSB7XG4gICAgdmFyIGJlZ2luID0gRGF0ZS5ub3coKTtcbiAgICB2YXIgZW5kO1xuICAgIHZhciBzZWNvbmRlc1BlckRheSA9IDM2MDAgKiB0aGlzLmFyY2hpdmVUaW1lLmdldCgpO1xuXG4gICAgc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4ge1xuICAgICAgZW5kID0gRGF0ZS5ub3coKTtcbiAgICAgIGF3YWl0IHRoaXMuYXJjaGl2ZURhdGUoYmVnaW4sIGVuZCk7XG4gICAgICAvLyBiZWdpbiA9IGRhdGUubm93KCk7XG4gICAgfSwgc2Vjb25kZXNQZXJEYXkgKiAxMDAwKTtcbiAgfVxuXG4gIC8qKioqIENldHRlIGZvbmN0aW9uIG5lIGRvaXMgcGFzIMOqdHJlIHV0aWxpc8OpZSBwYXIgbCd1dGlsaXNhdGV1ciAqL1xuICBmb3JtYXREYXRlKCkge1xuICAgIHZhciB0ID0gbmV3IERhdGUoKTtcbiAgICByZXR1cm4gKFxuICAgICAgdC5nZXRGdWxsWWVhcigpICtcbiAgICAgIFwiLVwiICtcbiAgICAgICh0LmdldE1vbnRoKCkgKyAxKSArXG4gICAgICBcIi1cIiArXG4gICAgICB0LmdldERhdGUoKSArXG4gICAgICBcIiBcIiArXG4gICAgICB0LmdldEhvdXJzKCkgK1xuICAgICAgXCI6XCIgK1xuICAgICAgdC5nZXRNaW51dGVzKCkgK1xuICAgICAgXCI6XCIgK1xuICAgICAgdC5nZXRTZWNvbmRzKClcbiAgICApO1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBUaW1lU2VyaWVzO1xuc3BpbmFsQ29yZS5yZWdpc3Rlcl9tb2RlbHMoW1RpbWVTZXJpZXNdKTsiXX0=