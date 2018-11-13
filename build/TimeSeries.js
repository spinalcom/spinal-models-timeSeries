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

      var timeS = new _TimeSeriesData2.default(new Date(date).getTime(), value);
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
    var secondesPerDay = 30; //3600 * this.archiveTime.get();

    setInterval(_asyncToGenerator(function* () {
      console.log("arhivage!!!");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UaW1lU2VyaWVzLmpzIl0sIm5hbWVzIjpbInNwaW5hbENvcmUiLCJyZXF1aXJlIiwiZ2xvYmFsVHlwZSIsIndpbmRvdyIsImdsb2JhbCIsIlRpbWVTZXJpZXMiLCJNb2RlbCIsImNvbnN0cnVjdG9yIiwiX25hbWUiLCJhcmNoaXZlVGltZSIsImZyZXF1ZW5jeSIsImRhdGEiLCJMc3QiLCJuYW1lIiwiRmlsZVN5c3RlbSIsIl9zaWdfc2VydmVyIiwiYWRkX2F0dHIiLCJpZCIsIlV0aWxpdGllcyIsImd1aWQiLCJhcmNoaXZlIiwiUHRyIiwiYXJjaGl2ZURhdGFQZXJEYXkiLCJhZGRUb1RpbWVTZXJpZXMiLCJ2YWx1ZSIsInRpbWVTIiwiVGltZVNlcmllc0RhdGEiLCJEYXRlIiwiZGF0ZSIsImdldFRpbWUiLCJwdXNoIiwiZ2V0VGltZVNlcmllc0N1cnJlbnRWYWx1ZSIsImxlbmd0aCIsImdldFRpbWVTZXJpZXNCZXR3ZWVuRGF0ZXMiLCJhcmdCZWdpbkRhdGUiLCJhcmdFbmREYXRlIiwiYmVnaW4iLCJlbmQiLCJpIiwiZCIsImRhdGVUb01zIiwiZ2V0IiwiZ2V0RGF0ZVZhbHVlIiwiYXJnRGF0ZSIsInQiLCJyZW1vdmVEYXRlIiwiZGF0ZVRvUmVtb3ZlIiwiZGF0ZVJlbW92ZWQiLCJzcGxpY2UiLCJ1bmRlZmluZWQiLCJhZGREYXRlVG9UaW1lU2VyaWVzQXJjaGl2ZSIsImxvYWQiLCJlbCIsImFyY2hpdmVEYXRlIiwiYmVnaW5EYXRlIiwiZW5kRGF0ZSIsImRhdGVUb0FyY2hpdmUiLCJkYXRlQXJjaGl2ZWQiLCJnZXREYXRlQXJjaGl2ZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm5vdyIsInNlY29uZGVzUGVyRGF5Iiwic2V0SW50ZXJ2YWwiLCJjb25zb2xlIiwibG9nIiwiZm9ybWF0RGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsInJl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QixDQUFOO0FBQ0FELGNBQVFSLEtBQUtrQyxHQUFMLEVBQVI7QUFDRCxLQUxELEdBS0dDLGlCQUFpQixJQUxwQjtBQU1EOztBQUVEO0FBQ0FJLGVBQWE7QUFDWCxRQUFJdkIsSUFBSSxJQUFJakIsSUFBSixFQUFSO0FBQ0EsV0FDRWlCLEVBQUV3QixXQUFGLEtBQ0EsR0FEQSxJQUVDeEIsRUFBRXlCLFFBQUYsS0FBZSxDQUZoQixJQUdBLEdBSEEsR0FJQXpCLEVBQUUwQixPQUFGLEVBSkEsR0FLQSxHQUxBLEdBTUExQixFQUFFMkIsUUFBRixFQU5BLEdBT0EsR0FQQSxHQVFBM0IsRUFBRTRCLFVBQUYsRUFSQSxHQVNBLEdBVEEsR0FVQTVCLEVBQUU2QixVQUFGLEVBWEY7QUFhRDtBQXhOdUM7a0JBME4zQnBFLFU7O0FBQ2ZMLFdBQVcwRSxlQUFYLENBQTJCLENBQUNyRSxVQUFELENBQTNCIiwiZmlsZSI6IlRpbWVTZXJpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzcGluYWxDb3JlID0gcmVxdWlyZShcInNwaW5hbC1jb3JlLWNvbm5lY3RvcmpzXCIpO1xuY29uc3QgZ2xvYmFsVHlwZSA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB3aW5kb3c7XG5pbXBvcnQge1xuICBVdGlsaXRpZXNcbn0gZnJvbSBcIi4vVXRpbGl0aWVzXCI7XG5cbmltcG9ydCBUaW1lU2VyaWVzRGF0YSBmcm9tIFwiLi9UaW1lU2VyaWVzRGF0YVwiO1xuXG4vKipcbiAqXG4gKlxuICogQGNsYXNzIFRpbWVTZXJpZXNcbiAqIEBleHRlbmRzIHtNb2RlbH1cbiAqL1xuY2xhc3MgVGltZVNlcmllcyBleHRlbmRzIGdsb2JhbFR5cGUuTW9kZWwge1xuICAvKipcbiAgICpDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFRpbWVTZXJpZXMuXG4gICAqSXQgdGFrZXMgYXMgcGFyYW1ldGVycyB0aGUgbmFtZSBvZiB0aGUgdGltZVNlcmllcyAoX25hbWUpIGEgc3RyaW5nLFxuICAgKnRoZSBudW1iZXIgb2YgaG91cnMgZHVyaW5nIHdoaWNoIHRoZSBkYXRhIGlzIHNhdmVkLCBhZnRlciB0aGF0IHRoZSBkYXRhIGlzIGFyY2hpdmVkXG4gICAqYSBmcmVxdWVuY3kgKGZyZXF1ZW5jeSkgb2YgYWRkaW5nIGRhdGEgaW4gc2Vjb25kcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtfbmFtZT1UaW1lU2VyaWVzXSAtIFRpbWVTZXJpZXMgbmFtZVxuICAgKiBAcGFyYW0ge251bWJlcn0gW2FyY2hpdmVUaW1lPTI0XSAtIGluIGhvdXJzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZnJlcXVlbmN5PTVdIC0gaW4gc2Vjb25kXG4gICAqIEBwYXJhbSB7THN0fSBbZGF0YT1uZXcgTHN0KCldIC0gdGltZVNlcmllcyBEYXRhXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBfbmFtZSA9IFwiVGltZVNlcmllc1wiLFxuICAgIGFyY2hpdmVUaW1lID0gMjQsXG4gICAgZnJlcXVlbmN5ID0gNSxcbiAgICBkYXRhID0gbmV3IExzdCgpLFxuICAgIG5hbWUgPSBcIlRpbWVTZXJpZXNcIlxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIGlmIChGaWxlU3lzdGVtLl9zaWdfc2VydmVyKSB7XG4gICAgICB0aGlzLmFkZF9hdHRyKHtcbiAgICAgICAgaWQ6IFV0aWxpdGllcy5ndWlkKHRoaXMuY29uc3RydWN0b3IubmFtZSksXG4gICAgICAgIG5hbWU6IF9uYW1lLFxuICAgICAgICBhcmNoaXZlVGltZTogYXJjaGl2ZVRpbWUsXG4gICAgICAgIGZyZXF1ZW5jeTogZnJlcXVlbmN5LFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBhcmNoaXZlOiBuZXcgUHRyKG5ldyBMc3QoKSlcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hcmNoaXZlRGF0YVBlckRheSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKnRha2VzIGFzIHBhcmFtZXRlciBhIG51bWJlciAoZGF0YSB0byBzYXZlICkgYW5kIHNhdmVzIGFuIG9iamVjdCBvZiB0eXBlIHtkYXRlOiBzYXZlRGF0ZSwgdmFsdWU6IGRhdGFUb1NhdmV9IGluIHRpbWVTZXJpZXMgZGF0YVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBWYWx1ZSBUbyBTYXZlIChtYW5kYXRvcnkpXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBhZGRUb1RpbWVTZXJpZXModmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiKSB0aHJvdyBcInRoZSBwYXJhbWV0ZXIgdmFsdWUgaXMgbWFuZGF0b3J5IGluIGFkZFRvVGltZVNlcmllcyBNZXRob2QgIVwiXG5cbiAgICB2YXIgdGltZVMgPSBuZXcgVGltZVNlcmllc0RhdGEobmV3IERhdGUoZGF0ZSkuZ2V0VGltZSgpLCB2YWx1ZSk7XG4gICAgdGhpcy5kYXRhLnB1c2godGltZVMpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIGRhdGUgYW5kIHZhbHVlIG9mIGN1cnJlbnQgdGltZVNlcmllc1xuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgZ2V0VGltZVNlcmllc0N1cnJlbnRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKlRha2VzIGFzIHBhcmFtZXRlcnMgdHdvIGRhdGVzIChpbiBtaWxsaXNlY29uZCBvciBhIGRhdGUgc3RyaW5nIGluIGEgdmFsaWQgZm9ybWF0LCBwcmVmZXJhYmx5IFwieWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzXCIgZm9yIGV4YW1wbGUgOiAyMDE4LTEwLTI1IDE2OjI2OjMwIClcbiAgICphbmQgcmV0dXJucyBhIEFycmF5IG9mIGFsbCB0aW1lU2VyaWVzIGJldHdlZW4gdGhlIHR3byBkYXRlc1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGV9IGFyZ0JlZ2luRGF0ZSAtIE11c3QgYmUgYSBkYXRlIGluIG1pbGlzZWNvbmQgb3IgaW4geWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzIGZvcm1hdCBcbiAgICogQHBhcmFtIHtEYXRlfSBhcmdFbmREYXRlIC0gdGhlIGxhc3QgZGF0ZSBpbiBtaWxpc2Vjb25kIG9yIGluIHllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kcyBmb3JtYXQgXG4gICAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2YgYWxsIHRpbWVTZXJpZXMgYmV0d2VlbiBhcmdCZWdpbkRhdGUgYW5kIGFyZ0VuZERhdGVcbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFzeW5jIGdldFRpbWVTZXJpZXNCZXR3ZWVuRGF0ZXMoYXJnQmVnaW5EYXRlLCBhcmdFbmREYXRlKSB7XG5cbiAgICBpZiAoIWFyZ0JlZ2luRGF0ZSB8fCAhYXJnRW5kRGF0ZSkgdGhyb3cgXCJ0aGUgcGFyYW1ldGVycyBhcmdCZWdpbkRhdGUgYW5kIGFyZ0VuZERhdGUgYXJlIG1hbmRhdG9yeSBpbiBnZXRUaW1lU2VyaWVzQmV0d2VlbkRhdGVzIE1ldGhvZCAhXCI7XG5cbiAgICB2YXIgdGltZVMgPSBbXTtcbiAgICB2YXIgYmVnaW4gPSBuZXcgRGF0ZShhcmdCZWdpbkRhdGUpLmdldFRpbWUoKTtcbiAgICB2YXIgZW5kID0gbmV3IERhdGUoYXJnRW5kRGF0ZSkuZ2V0VGltZSgpO1xuXG4gICAgaWYgKGJlZ2luID4gZW5kKSBiZWdpbiA9IFtlbmQsIChlbmQgPSBiZWdpbildWzBdOyAvL3N3YXAgYmVnaW4gYW5kIGVuZCBpZiBlbmQgPCBiZWdpblxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkID0gdGhpcy5kYXRhW2ldO1xuICAgICAgdmFyIGRhdGVUb01zID0gbmV3IERhdGUoZC5kYXRlLmdldCgpKS5nZXRUaW1lKCk7XG5cbiAgICAgIGlmIChkYXRlVG9NcyA+PSBiZWdpbiAmJiBkYXRlVG9NcyA8PSBlbmQpIHtcbiAgICAgICAgdGltZVMucHVzaChkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGltZVM7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICpJdCBUYWtlcyBhIGRhdGUgYXMgcGFyYW1zIGFuZCByZXR1cm4gdGhlIGRhdGEgY29ycmVzcG9uZGluZyB0byB0aGlzIGRhdGUsXG4gICAqaXQgcmV0dXJucyBhbiBlbXB0eSBvYmplY3QgaWYgbm8gZGF0YSBpcyBhc3NvY2lhdGVkIHdpdGggdGhlIGRhdGVcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlfSBhcmdEYXRlIC0gTXVzdCBiZSBhIGRhdGUgaW4gbWlsaXNlY29uZCBvciBpbiB5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHMgZm9ybWF0IFxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSByZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBkYXRlIGFuZCBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gYXJnRGF0ZVxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgZ2V0RGF0ZVZhbHVlKGFyZ0RhdGUpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGFyZ0RhdGUpLmdldFRpbWUoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdCA9IG5ldyBEYXRlKHRoaXMuZGF0YVtpXS5kYXRlLmdldCgpKS5nZXRUaW1lKCk7XG4gICAgICBpZiAodCA9PSBkYXRlKSByZXR1cm4gdGhpcy5kYXRhW2ldO1xuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogSXQgdGFrZXMgYSBkYXRlIGFzIGEgcGFyYW1zIGFuZCByZW1vdmUgYW5kIHJldHVybnMgdGhlIGRhdGEgY29ycmVzcG9uZGluZyB0byB0aGlzIGRhdGVcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlfSBkYXRlVG9SZW1vdmUgLSBNdXN0IGJlIGEgZGF0ZSBpbiBtaWxpc2Vjb25kIG9yIGluIHllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kcyBmb3JtYXQgXG4gICAqIEByZXR1cm5zIHtPYmplY3R8dW5kZWZpbmVkfSByZXR1cm5zIHRoZSBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBkYXRlLCByZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBkYXRhIGZvdW5kLlxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgcmVtb3ZlRGF0ZShkYXRlVG9SZW1vdmUpIHtcbiAgICB2YXIgZCA9IG5ldyBEYXRlKGRhdGVUb1JlbW92ZSkuZ2V0VGltZSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5kYXRhW2ldLmRhdGUuZ2V0KCkgPT0gZCkge1xuICAgICAgICB2YXIgZGF0ZVJlbW92ZWQgPSB0aGlzLmRhdGFbaV07XG4gICAgICAgIHRoaXMuZGF0YS5zcGxpY2UoaSwgMSk7XG4gICAgICAgIHJldHVybiBkYXRlUmVtb3ZlZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqKiogRm9uY3Rpb24gbm9uIHV0aWxpc8OpZXMgcGFyIGwndXRpbGlzYXRldXIgKi9cbiAgYXN5bmMgYWRkRGF0ZVRvVGltZVNlcmllc0FyY2hpdmUoYXJnRGF0ZSkge1xuICAgIHJldHVybiB0aGlzLmFyY2hpdmUubG9hZChlbCA9PiB7XG4gICAgICBlbC5wdXNoKGFyZ0RhdGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIHRoaXMgZnVuY3Rpb24gdGFrZXMgYXMgcGFyYW1ldGVycyB0d28gZGF0ZSAob25lIG9wdGlvbmFsKSxcbiAgICogaWYgYm90aCBkYXRlcyBhcmUgZ2l2ZW4gaXQgYXJjaGl2ZXMgYWxsIGRhdGUgYmV0d2VlbiBib3RoICh0aGV5IGV2ZW4gaW5jbHVkZWQpXG4gICAqIGVsc2UgaXQgYXJjaGl2ZXMgdGhlIGRhdGUgZ2l2ZW5cbiAgICpcbiAgICogQHBhcmFtIHtEYXRlfSBiZWdpbkRhdGUgLSBNdXN0IGJlIGEgZGF0ZSBpbiBtaWxpc2Vjb25kIG9yIGluIHllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kcyBmb3JtYXQgXG4gICAqIEBwYXJhbSB7RGF0ZX0gW2VuZERhdGU9dW5kZWZpbmVkXSAtIE9wdGlvbmFsLCBtdXN0IGJlIGEgZGF0ZSBpbiBtaWxpc2Vjb25kIG9yIGluIHllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kcyBmb3JtYXRcbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFzeW5jIGFyY2hpdmVEYXRlKGJlZ2luRGF0ZSwgZW5kRGF0ZSA9IHVuZGVmaW5lZCkge1xuICAgIHZhciBkYXRlVG9BcmNoaXZlID0gW107XG5cbiAgICBpZiAoIWVuZERhdGUpIHtcbiAgICAgIHZhciBkID0gYXdhaXQgdGhpcy5nZXREYXRlVmFsdWUoYmVnaW5EYXRlKTtcbiAgICAgIGRhdGVUb0FyY2hpdmUucHVzaChkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0ZVRvQXJjaGl2ZSA9IGF3YWl0IHRoaXMuZ2V0VGltZVNlcmllc0JldHdlZW5EYXRlcyhiZWdpbkRhdGUsXG4gICAgICAgIGVuZERhdGUpO1xuICAgIH1cblxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRlVG9BcmNoaXZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGF0ZUFyY2hpdmVkID0gYXdhaXQgdGhpcy5yZW1vdmVEYXRlKGRhdGVUb0FyY2hpdmVbaV0uZGF0ZS5nZXQoKSk7XG4gICAgICBpZiAoZGF0ZUFyY2hpdmVkKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYWRkRGF0ZVRvVGltZVNlcmllc0FyY2hpdmUoZGF0ZUFyY2hpdmVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogdGhpcyBmdW5jdGlvbiBhbGxvd3MgdG8gZ2V0IGFsbCBkYXRhIGFyY2hpdmVkLCBpdCByZXR1cm5zIGEgUHJvbWlzZVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gYSBwcm9taXNlIG9mIGFsbCBhcmNoaXZlZCBkYXRhXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBnZXREYXRlQXJjaGl2ZWQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuYXJjaGl2ZS5sb2FkKGVsID0+IHtcbiAgICAgICAgcmVzb2x2ZShlbCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKnRoaXMgZnVuY3Rpb24gYWxsb3dzIHRvIGFyY2hpdmUgdGhlIGRhdGEgb2YgdGhlIHRpbWVTZXJpZXMsIGJ5IGNoYW5naW5nIHRoZSBhdHRyaWJ1dGUgYXJjaGl2ZVRpbWUgeW91IGNoYW5nZSB0aGUgYXJjaGl2aW5nIGZyZXF1ZW5jeS5cbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFyY2hpdmVEYXRhUGVyRGF5KCkge1xuICAgIHZhciBiZWdpbiA9IERhdGUubm93KCk7XG4gICAgdmFyIGVuZDtcbiAgICB2YXIgc2Vjb25kZXNQZXJEYXkgPSAzMCAvLzM2MDAgKiB0aGlzLmFyY2hpdmVUaW1lLmdldCgpO1xuXG4gICAgc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJhcmhpdmFnZSEhIVwiKTtcbiAgICAgIGVuZCA9IERhdGUubm93KCk7XG4gICAgICBhd2FpdCB0aGlzLmFyY2hpdmVEYXRlKGJlZ2luLCBlbmQpO1xuICAgICAgYmVnaW4gPSBkYXRlLm5vdygpO1xuICAgIH0sIHNlY29uZGVzUGVyRGF5ICogMTAwMCk7XG4gIH1cblxuICAvKioqKiBDZXR0ZSBmb25jdGlvbiBuZSBkb2lzIHBhcyDDqnRyZSB1dGlsaXPDqWUgcGFyIGwndXRpbGlzYXRldXIgKi9cbiAgZm9ybWF0RGF0ZSgpIHtcbiAgICB2YXIgdCA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIChcbiAgICAgIHQuZ2V0RnVsbFllYXIoKSArXG4gICAgICBcIi1cIiArXG4gICAgICAodC5nZXRNb250aCgpICsgMSkgK1xuICAgICAgXCItXCIgK1xuICAgICAgdC5nZXREYXRlKCkgK1xuICAgICAgXCIgXCIgK1xuICAgICAgdC5nZXRIb3VycygpICtcbiAgICAgIFwiOlwiICtcbiAgICAgIHQuZ2V0TWludXRlcygpICtcbiAgICAgIFwiOlwiICtcbiAgICAgIHQuZ2V0U2Vjb25kcygpXG4gICAgKTtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgVGltZVNlcmllcztcbnNwaW5hbENvcmUucmVnaXN0ZXJfbW9kZWxzKFtUaW1lU2VyaWVzXSk7Il19