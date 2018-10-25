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
   * @param {string} [_name="TimeSeries"]
   * @param {number} [archiveTime=24] - in hours
   * @param {number} [frequency=5] - in second
   * @param {Lst} [data=new Lst()]
   * @memberof TimeSeries
   */
  constructor(_name = "TimeSeries", archiveTime = 24, frequency = 5, // in s
  data = new Lst(), name = "TimeSeries") {
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
   * @param {number} value
   * @memberof TimeSeries
   */
  addToTimeSeries(value) {
    var _this = this;

    return _asyncToGenerator(function* () {
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
   *Takes as parameters two dates (in millisecond or a date string in a valid format, preferably "year-month-day hours-minutes-seconds" for example : 2018-10-25 16:26:30 )
   *and returns a Array of all timeSeries between the two dates
   *
   * @param {Date} argBeginDate
   * @param {Date} argEndDate
   * @returns {Array} Array of all timeSeries between argBeginDate and argEndDate
   * @memberof TimeSeries
   */
  getTimeSeriesBetweenDates(argBeginDate, argEndDate) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
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
   * @param {Date} argDate
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
   * @param {Date} dateToRemove
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
   * @param {Date} beginDate
   * @param {Date} [endDate=undefined]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UaW1lU2VyaWVzLmpzIl0sIm5hbWVzIjpbInNwaW5hbENvcmUiLCJyZXF1aXJlIiwiZ2xvYmFsVHlwZSIsIndpbmRvdyIsImdsb2JhbCIsIlRpbWVTZXJpZXMiLCJNb2RlbCIsImNvbnN0cnVjdG9yIiwiX25hbWUiLCJhcmNoaXZlVGltZSIsImZyZXF1ZW5jeSIsImRhdGEiLCJMc3QiLCJuYW1lIiwiRmlsZVN5c3RlbSIsIl9zaWdfc2VydmVyIiwiYWRkX2F0dHIiLCJpZCIsIlV0aWxpdGllcyIsImd1aWQiLCJhcmNoaXZlIiwiUHRyIiwiYWRkVG9UaW1lU2VyaWVzIiwidmFsdWUiLCJ0aW1lUyIsIlRpbWVTZXJpZXNEYXRhIiwiRGF0ZSIsIm5vdyIsInB1c2giLCJnZXRUaW1lU2VyaWVzQ3VycmVudFZhbHVlIiwibGVuZ3RoIiwiZ2V0VGltZVNlcmllc0JldHdlZW5EYXRlcyIsImFyZ0JlZ2luRGF0ZSIsImFyZ0VuZERhdGUiLCJiZWdpbiIsImdldFRpbWUiLCJlbmQiLCJpIiwiZCIsImRhdGVUb01zIiwiZGF0ZSIsImdldCIsImdldERhdGVWYWx1ZSIsImFyZ0RhdGUiLCJ0IiwicmVtb3ZlRGF0ZSIsImRhdGVUb1JlbW92ZSIsImdldERhdGUiLCJkYXRlUmVtb3ZlZCIsInNwbGljZSIsInVuZGVmaW5lZCIsImFkZERhdGVUb1RpbWVTZXJpZXNBcmNoaXZlIiwibG9hZCIsImVsIiwiYXJjaGl2ZURhdGUiLCJiZWdpbkRhdGUiLCJlbmREYXRlIiwiZGF0ZVRvQXJjaGl2ZSIsImRhdGVBcmNoaXZlZCIsImdldERhdGVBcmNoaXZlZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJjaGl2ZURhdGFQZXJEYXkiLCJzZWNvbmRlc1BlckRheSIsInNldEludGVydmFsIiwiZm9ybWF0RGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwicmVnaXN0ZXJfbW9kZWxzIl0s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QUV5QixRQUFGLEVBTkEsR0FPQSxHQVBBLEdBUUF6QixFQUFFMEIsVUFBRixFQVJBLEdBU0EsR0FUQSxHQVVBMUIsRUFBRTJCLFVBQUYsRUFYRjtBQWFEO0FBOU11QztrQkFnTjNCbEUsVTs7QUFDZkwsV0FBV3dFLGVBQVgsQ0FBMkIsQ0FBQ25FLFVBQUQsQ0FBM0IiLCJmaWxlIjoiVGltZVNlcmllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHNwaW5hbENvcmUgPSByZXF1aXJlKFwic3BpbmFsLWNvcmUtY29ubmVjdG9yanNcIik7XG5jb25zdCBnbG9iYWxUeXBlID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHdpbmRvdztcbmltcG9ydCB7IFV0aWxpdGllcyB9IGZyb20gXCIuLi9VdGlsaXRpZXNcIjtcblxuaW1wb3J0IFRpbWVTZXJpZXNEYXRhIGZyb20gXCIuL1RpbWVTZXJpZXNEYXRhXCI7XG5cbi8qKlxuICpcbiAqXG4gKiBAY2xhc3MgVGltZVNlcmllc1xuICogQGV4dGVuZHMge01vZGVsfVxuICovXG5jbGFzcyBUaW1lU2VyaWVzIGV4dGVuZHMgZ2xvYmFsVHlwZS5Nb2RlbCB7XG4gIC8qKlxuICAgKkNyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgVGltZVNlcmllcy5cbiAgICpJdCB0YWtlcyBhcyBwYXJhbWV0ZXJzIHRoZSBuYW1lIG9mIHRoZSB0aW1lU2VyaWVzIChfbmFtZSkgYSBzdHJpbmcsXG4gICAqdGhlIG51bWJlciBvZiBob3VycyBkdXJpbmcgd2hpY2ggdGhlIGRhdGEgaXMgc2F2ZWQsIGFmdGVyIHRoYXQgdGhlIGRhdGEgaXMgYXJjaGl2ZWRcbiAgICphIGZyZXF1ZW5jeSAoZnJlcXVlbmN5KSBvZiBhZGRpbmcgZGF0YSBpbiBzZWNvbmRzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW19uYW1lPVwiVGltZVNlcmllc1wiXVxuICAgKiBAcGFyYW0ge251bWJlcn0gW2FyY2hpdmVUaW1lPTI0XSAtIGluIGhvdXJzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZnJlcXVlbmN5PTVdIC0gaW4gc2Vjb25kXG4gICAqIEBwYXJhbSB7THN0fSBbZGF0YT1uZXcgTHN0KCldXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBfbmFtZSA9IFwiVGltZVNlcmllc1wiLFxuICAgIGFyY2hpdmVUaW1lID0gMjQsXG4gICAgZnJlcXVlbmN5ID0gNSwgLy8gaW4gc1xuICAgIGRhdGEgPSBuZXcgTHN0KCksXG4gICAgbmFtZSA9IFwiVGltZVNlcmllc1wiXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgaWYgKEZpbGVTeXN0ZW0uX3NpZ19zZXJ2ZXIpIHtcbiAgICAgIHRoaXMuYWRkX2F0dHIoe1xuICAgICAgICBpZDogVXRpbGl0aWVzLmd1aWQodGhpcy5jb25zdHJ1Y3Rvci5uYW1lKSxcbiAgICAgICAgbmFtZTogX25hbWUsXG4gICAgICAgIGFyY2hpdmVUaW1lOiBhcmNoaXZlVGltZSxcbiAgICAgICAgZnJlcXVlbmN5OiBmcmVxdWVuY3ksXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGFyY2hpdmU6IG5ldyBQdHIobmV3IExzdCgpKVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqdGFrZXMgYXMgcGFyYW1ldGVyIGEgbnVtYmVyIChkYXRhIHRvIHNhdmUgKSBhbmQgc2F2ZXMgYW4gb2JqZWN0IG9mIHR5cGUge2RhdGU6IHNhdmVEYXRlLCB2YWx1ZTogZGF0YVRvU2F2ZX0gaW4gdGltZVNlcmllcyBkYXRhXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgYWRkVG9UaW1lU2VyaWVzKHZhbHVlKSB7XG4gICAgdmFyIHRpbWVTID0gbmV3IFRpbWVTZXJpZXNEYXRhKERhdGUubm93KCksIHZhbHVlKTtcbiAgICB0aGlzLmRhdGEucHVzaCh0aW1lUyk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gcmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZGF0ZSBhbmQgdmFsdWUgb2YgY3VycmVudCB0aW1lU2VyaWVzXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBnZXRUaW1lU2VyaWVzQ3VycmVudFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqVGFrZXMgYXMgcGFyYW1ldGVycyB0d28gZGF0ZXMgKGluIG1pbGxpc2Vjb25kIG9yIGEgZGF0ZSBzdHJpbmcgaW4gYSB2YWxpZCBmb3JtYXQsIHByZWZlcmFibHkgXCJ5ZWFyLW1vbnRoLWRheSBob3Vycy1taW51dGVzLXNlY29uZHNcIiBmb3IgZXhhbXBsZSA6IDIwMTgtMTAtMjUgMTY6MjY6MzAgKVxuICAgKmFuZCByZXR1cm5zIGEgQXJyYXkgb2YgYWxsIHRpbWVTZXJpZXMgYmV0d2VlbiB0aGUgdHdvIGRhdGVzXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZX0gYXJnQmVnaW5EYXRlXG4gICAqIEBwYXJhbSB7RGF0ZX0gYXJnRW5kRGF0ZVxuICAgKiBAcmV0dXJucyB7QXJyYXl9IEFycmF5IG9mIGFsbCB0aW1lU2VyaWVzIGJldHdlZW4gYXJnQmVnaW5EYXRlIGFuZCBhcmdFbmREYXRlXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBnZXRUaW1lU2VyaWVzQmV0d2VlbkRhdGVzKGFyZ0JlZ2luRGF0ZSwgYXJnRW5kRGF0ZSkge1xuICAgIHZhciB0aW1lUyA9IFtdO1xuICAgIHZhciBiZWdpbiA9IG5ldyBEYXRlKGFyZ0JlZ2luRGF0ZSkuZ2V0VGltZSgpO1xuICAgIHZhciBlbmQgPSBuZXcgRGF0ZShhcmdFbmREYXRlKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAoYmVnaW4gPiBlbmQpIGJlZ2luID0gW2VuZCwgKGVuZCA9IGJlZ2luKV1bMF07IC8vc3dhcCBiZWdpbiBhbmQgZW5kIGlmIGVuZCA8IGJlZ2luXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGQgPSB0aGlzLmRhdGFbaV07XG4gICAgICB2YXIgZGF0ZVRvTXMgPSBuZXcgRGF0ZShkLmRhdGUuZ2V0KCkpLmdldFRpbWUoKTtcbiAgICAgIGlmIChkYXRlVG9NcyA+PSBiZWdpbiAmJiBkYXRlVG9NcyA8PSBlbmQpIHtcbiAgICAgICAgdGltZVMucHVzaChkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGltZVM7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICpJdCBUYWtlcyBhIGRhdGUgYXMgcGFyYW1zIGFuZCByZXR1cm4gdGhlIGRhdGEgY29ycmVzcG9uZGluZyB0byB0aGlzIGRhdGUsXG4gICAqaXQgcmV0dXJucyBhbiBlbXB0eSBvYmplY3QgaWYgbm8gZGF0YSBpcyBhc3NvY2lhdGVkIHdpdGggdGhlIGRhdGVcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlfSBhcmdEYXRlXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIGRhdGUgYW5kIGRhdGEgY29ycmVzcG9uZGluZyB0byBhcmdEYXRlXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBnZXREYXRlVmFsdWUoYXJnRGF0ZSkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoYXJnRGF0ZSkuZ2V0VGltZSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0ID0gbmV3IERhdGUodGhpcy5kYXRhW2ldLmRhdGUuZ2V0KCkpLmdldFRpbWUoKTtcbiAgICAgIGlmICh0ID09IGRhdGUpIHJldHVybiB0aGlzLmRhdGFbaV0uZGF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEl0IHRha2VzIGEgZGF0ZSBhcyBhIHBhcmFtcyBhbmQgcmVtb3ZlIGFuZCByZXR1cm5zIHRoZSBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBkYXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZVRvUmVtb3ZlXG4gICAqIEByZXR1cm5zIHtPYmplY3R8dW5kZWZpbmVkfSByZXR1cm5zIHRoZSBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBkYXRlLCByZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBkYXRhIGZvdW5kLlxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgcmVtb3ZlRGF0ZShkYXRlVG9SZW1vdmUpIHtcbiAgICB2YXIgZCA9IG5ldyBEYXRlKGRhdGVUb1JlbW92ZSkuZ2V0RGF0ZSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmRhdGFbaV0uZGF0ZS5nZXQoKSA9PSBkYXRlVG9SZW1vdmUpIHtcbiAgICAgICAgdmFyIGRhdGVSZW1vdmVkID0gdGhpcy5kYXRhW2ldO1xuICAgICAgICB0aGlzLmRhdGEuc3BsaWNlKGksIDApO1xuICAgICAgICByZXR1cm4gZGF0ZVJlbW92ZWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKioqIEZvbmN0aW9uIG5vbiB1dGlsaXPDqWVzIHBhciBsJ3V0aWxpc2F0ZXVyICovXG4gIGFzeW5jIGFkZERhdGVUb1RpbWVTZXJpZXNBcmNoaXZlKGFyZ0RhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5hcmNoaXZlLmxvYWQoZWwgPT4ge1xuICAgICAgZWwucHVzaChhcmdEYXRlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiB0aGlzIGZ1bmN0aW9uIHRha2VzIGFzIHBhcmFtZXRlcnMgdHdvIGRhdGUgKG9uZSBvcHRpb25hbCksXG4gICAqIGlmIGJvdGggZGF0ZXMgYXJlIGdpdmVuIGl0IGFyY2hpdmVzIGFsbCBkYXRlIGJldHdlZW4gYm90aCAodGhleSBldmVuIGluY2x1ZGVkKVxuICAgKiBlbHNlIGl0IGFyY2hpdmVzIHRoZSBkYXRlIGdpdmVuXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZX0gYmVnaW5EYXRlXG4gICAqIEBwYXJhbSB7RGF0ZX0gW2VuZERhdGU9dW5kZWZpbmVkXVxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgYXJjaGl2ZURhdGUoYmVnaW5EYXRlLCBlbmREYXRlID0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGRhdGVUb0FyY2hpdmUgPSBbXTtcblxuICAgIGlmICghZW5kRGF0ZSkge1xuICAgICAgdmFyIGQgPSBhd2FpdCB0aGlzLmdldERhdGVWYWx1ZShiZWdpbkRhdGUpO1xuICAgICAgZGF0ZVRvQXJjaGl2ZS5wdXNoKGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRlVG9BcmNoaXZlID0gYXdhaXQgdGhpcy5nZXRUaW1lU2VyaWVzQmV0d2VlbkRhdGVzKGJlZ2luRGF0ZSwgZW5kRGF0ZSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRlVG9BcmNoaXZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGF0ZUFyY2hpdmVkID0gYXdhaXQgdGhpcy5yZW1vdmVEYXRlKGRhdGVUb0FyY2hpdmVbaV0pO1xuICAgICAgaWYgKGRhdGVBcmNoaXZlZCkge1xuICAgICAgICBhd2FpdCB0aGlzLmFkZERhdGVUb1RpbWVTZXJpZXNBcmNoaXZlKGRhdGVBcmNoaXZlZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIHRoaXMgZnVuY3Rpb24gYWxsb3dzIHRvIGdldCBhbGwgZGF0YSBhcmNoaXZlZCwgaXQgcmV0dXJucyBhIFByb21pc2VcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IGEgcHJvbWlzZSBvZiBhbGwgYXJjaGl2ZWQgZGF0YVxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgZ2V0RGF0ZUFyY2hpdmVkKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmFyY2hpdmUubG9hZChlbCA9PiB7XG4gICAgICAgIHJlc29sdmUoZWwpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICp0aGlzIGZ1bmN0aW9uIGFsbG93cyB0byBhcmNoaXZlIHRoZSBkYXRhIG9mIHRoZSB0aW1lU2VyaWVzLCBieSBjaGFuZ2luZyB0aGUgYXR0cmlidXRlIGFyY2hpdmVUaW1lIHlvdSBjaGFuZ2UgdGhlIGFyY2hpdmluZyBmcmVxdWVuY3kuXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhcmNoaXZlRGF0YVBlckRheSgpIHtcbiAgICB2YXIgYmVnaW4gPSBEYXRlLm5vdygpO1xuICAgIHZhciBlbmQ7XG4gICAgdmFyIHNlY29uZGVzUGVyRGF5ID0gMzYwMCAqIHRoaXMuYXJjaGl2ZVRpbWUuZ2V0KCk7XG5cbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBlbmQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5hcmNoaXZlRGF0ZShiZWdpbiwgZW5kKTtcbiAgICB9LCBzZWNvbmRlc1BlckRheSAqIDEwMDApO1xuICB9XG5cbiAgLyoqKiogQ2V0dGUgZm9uY3Rpb24gbmUgZG9pcyBwYXMgw6p0cmUgdXRpbGlzw6llIHBhciBsJ3V0aWxpc2F0ZXVyICovXG4gIGZvcm1hdERhdGUoKSB7XG4gICAgdmFyIHQgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiAoXG4gICAgICB0LmdldEZ1bGxZZWFyKCkgK1xuICAgICAgXCItXCIgK1xuICAgICAgKHQuZ2V0TW9udGgoKSArIDEpICtcbiAgICAgIFwiLVwiICtcbiAgICAgIHQuZ2V0RGF0ZSgpICtcbiAgICAgIFwiIFwiICtcbiAgICAgIHQuZ2V0SG91cnMoKSArXG4gICAgICBcIjpcIiArXG4gICAgICB0LmdldE1pbnV0ZXMoKSArXG4gICAgICBcIjpcIiArXG4gICAgICB0LmdldFNlY29uZHMoKVxuICAgICk7XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFRpbWVTZXJpZXM7XG5zcGluYWxDb3JlLnJlZ2lzdGVyX21vZGVscyhbVGltZVNlcmllc10pO1xuIl19