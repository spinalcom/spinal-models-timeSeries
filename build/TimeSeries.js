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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UaW1lU2VyaWVzLmpzIl0sIm5hbWVzIjpbInNwaW5hbENvcmUiLCJyZXF1aXJlIiwiZ2xvYmFsVHlwZSIsIndpbmRvdyIsImdsb2JhbCIsIlRpbWVTZXJpZXMiLCJNb2RlbCIsImNvbnN0cnVjdG9yIiwiX25hbWUiLCJhcmNoaXZlVGltZSIsImZyZXF1ZW5jeSIsImRhdGEiLCJMc3QiLCJuYW1lIiwiRmlsZVN5c3RlbSIsIl9zaWdfc2VydmVyIiwiYWRkX2F0dHIiLCJpZCIsIlV0aWxpdGllcyIsImd1aWQiLCJhcmNoaXZlIiwiUHRyIiwiYWRkVG9UaW1lU2VyaWVzIiwidmFsdWUiLCJ0aW1lUyIsIlRpbWVTZXJpZXNEYXRhIiwiRGF0ZSIsIm5vdyIsInB1c2giLCJnZXRUaW1lU2VyaWVzQ3VycmVudFZhbHVlIiwibGVuZ3RoIiwiZ2V0VGltZVNlcmllc0JldHdlZW5EYXRlcyIsImFyZ0JlZ2luRGF0ZSIsImFyZ0VuZERhdGUiLCJiZWdpbiIsImdldFRpbWUiLCJlbmQiLCJpIiwiZCIsImRhdGVUb01zIiwiZGF0ZSIsImdldCIsImdldERhdGVWYWx1ZSIsImFyZ0RhdGUiLCJ0IiwicmVtb3ZlRGF0ZSIsImRhdGVUb1JlbW92ZSIsImdldERhdGUiLCJkYXRlUmVtb3ZlZCIsInNwbGljZSIsInVuZGVmaW5lZCIsImFkZERhdGVUb1RpbWVTZXJpZXNBcmNoaXZlIiwibG9hZCIsImVsIiwiYXJjaGl2ZURhdGUiLCJiZWdpbkRhdGUiLCJlbmREYXRlIiwiZGF0ZVRvQXJjaGl2ZSIsImRhdGVBcmNoaXZlZCIsImdldERhdGVBcmNoaXZlZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJjaGl2ZURhdGFQZXJEYXkiLCJzZWNvbmRlc1BlckRheSIsInNldEludGVydmFsIiwiZm9ybWF0RGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwicmVnaXN0ZXJfbW9kZWxzIl0s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RixLQUNBLEdBREEsSUFFQ3ZCLEVBQUV3QixRQUFGLEtBQWUsQ0FGaEIsSUFHQSxHQUhBLEdBSUF4QixFQUFFRyxPQUFGLEVBSkEsR0FLQSxHQUxBLEdBTUFILEVBQUV5QixRQUFGLEVBTkEsR0FPQSxHQVBBLEdBUUF6QixFQUFFMEIsVUFBRixFQVJBLEdBU0EsR0FUQSxHQVVBMUIsRUFBRTJCLFVBQUYsRUFYRjtBQWFEO0FBcE51QztrQkFzTjNCbEUsVTs7QUFDZkwsV0FBV3dFLGVBQVgsQ0FBMkIsQ0FBQ25FLFVBQUQsQ0FBM0IiLCJmaWxlIjoiVGltZVNlcmllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHNwaW5hbENvcmUgPSByZXF1aXJlKFwic3BpbmFsLWNvcmUtY29ubmVjdG9yanNcIik7XG5jb25zdCBnbG9iYWxUeXBlID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHdpbmRvdztcbmltcG9ydCB7XG4gIFV0aWxpdGllc1xufSBmcm9tIFwiLi9VdGlsaXRpZXNcIjtcblxuaW1wb3J0IFRpbWVTZXJpZXNEYXRhIGZyb20gXCIuL1RpbWVTZXJpZXNEYXRhXCI7XG5cbi8qKlxuICpcbiAqXG4gKiBAY2xhc3MgVGltZVNlcmllc1xuICogQGV4dGVuZHMge01vZGVsfVxuICovXG5jbGFzcyBUaW1lU2VyaWVzIGV4dGVuZHMgZ2xvYmFsVHlwZS5Nb2RlbCB7XG4gIC8qKlxuICAgKkNyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgVGltZVNlcmllcy5cbiAgICpJdCB0YWtlcyBhcyBwYXJhbWV0ZXJzIHRoZSBuYW1lIG9mIHRoZSB0aW1lU2VyaWVzIChfbmFtZSkgYSBzdHJpbmcsXG4gICAqdGhlIG51bWJlciBvZiBob3VycyBkdXJpbmcgd2hpY2ggdGhlIGRhdGEgaXMgc2F2ZWQsIGFmdGVyIHRoYXQgdGhlIGRhdGEgaXMgYXJjaGl2ZWRcbiAgICphIGZyZXF1ZW5jeSAoZnJlcXVlbmN5KSBvZiBhZGRpbmcgZGF0YSBpbiBzZWNvbmRzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW19uYW1lPVRpbWVTZXJpZXNdIC0gVGltZVNlcmllcyBuYW1lXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbYXJjaGl2ZVRpbWU9MjRdIC0gaW4gaG91cnNcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtmcmVxdWVuY3k9NV0gLSBpbiBzZWNvbmRcbiAgICogQHBhcmFtIHtMc3R9IFtkYXRhPW5ldyBMc3QoKV0gLSB0aW1lU2VyaWVzIERhdGFcbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIF9uYW1lID0gXCJUaW1lU2VyaWVzXCIsXG4gICAgYXJjaGl2ZVRpbWUgPSAyNCxcbiAgICBmcmVxdWVuY3kgPSA1LFxuICAgIGRhdGEgPSBuZXcgTHN0KCksXG4gICAgbmFtZSA9IFwiVGltZVNlcmllc1wiXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgaWYgKEZpbGVTeXN0ZW0uX3NpZ19zZXJ2ZXIpIHtcbiAgICAgIHRoaXMuYWRkX2F0dHIoe1xuICAgICAgICBpZDogVXRpbGl0aWVzLmd1aWQodGhpcy5jb25zdHJ1Y3Rvci5uYW1lKSxcbiAgICAgICAgbmFtZTogX25hbWUsXG4gICAgICAgIGFyY2hpdmVUaW1lOiBhcmNoaXZlVGltZSxcbiAgICAgICAgZnJlcXVlbmN5OiBmcmVxdWVuY3ksXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGFyY2hpdmU6IG5ldyBQdHIobmV3IExzdCgpKVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqdGFrZXMgYXMgcGFyYW1ldGVyIGEgbnVtYmVyIChkYXRhIHRvIHNhdmUgKSBhbmQgc2F2ZXMgYW4gb2JqZWN0IG9mIHR5cGUge2RhdGU6IHNhdmVEYXRlLCB2YWx1ZTogZGF0YVRvU2F2ZX0gaW4gdGltZVNlcmllcyBkYXRhXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIFZhbHVlIFRvIFNhdmUgKG1hbmRhdG9yeSlcbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFzeW5jIGFkZFRvVGltZVNlcmllcyh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUpIHRocm93IFwidGhlIHBhcmFtZXRlciB2YWx1ZSBpcyBtYW5kYXRvcnkgaW4gYWRkVG9UaW1lU2VyaWVzIE1ldGhvZCAhXCJcblxuICAgIHZhciB0aW1lUyA9IG5ldyBUaW1lU2VyaWVzRGF0YShEYXRlLm5vdygpLCB2YWx1ZSk7XG4gICAgdGhpcy5kYXRhLnB1c2godGltZVMpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIGRhdGUgYW5kIHZhbHVlIG9mIGN1cnJlbnQgdGltZVNlcmllc1xuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgZ2V0VGltZVNlcmllc0N1cnJlbnRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKlRha2VzIGFzIHBhcmFtZXRlcnMgdHdvIGRhdGVzIChpbiBtaWxsaXNlY29uZCBvciBhIGRhdGUgc3RyaW5nIGluIGEgdmFsaWQgZm9ybWF0LCBwcmVmZXJhYmx5IFwieWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzXCIgZm9yIGV4YW1wbGUgOiAyMDE4LTEwLTI1IDE2OjI2OjMwIClcbiAgICphbmQgcmV0dXJucyBhIEFycmF5IG9mIGFsbCB0aW1lU2VyaWVzIGJldHdlZW4gdGhlIHR3byBkYXRlc1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGV9IGFyZ0JlZ2luRGF0ZSAtIE11c3QgYmUgYSBkYXRlIGluIG1pbGlzZWNvbmQgb3IgaW4geWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzIGZvcm1hdCBcbiAgICogQHBhcmFtIHtEYXRlfSBhcmdFbmREYXRlIC0gdGhlIGxhc3QgZGF0ZSBpbiBtaWxpc2Vjb25kIG9yIGluIHllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kcyBmb3JtYXQgXG4gICAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2YgYWxsIHRpbWVTZXJpZXMgYmV0d2VlbiBhcmdCZWdpbkRhdGUgYW5kIGFyZ0VuZERhdGVcbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFzeW5jIGdldFRpbWVTZXJpZXNCZXR3ZWVuRGF0ZXMoYXJnQmVnaW5EYXRlLCBhcmdFbmREYXRlKSB7XG5cbiAgICBpZiAoIWFyZ0JlZ2luRGF0ZSB8fCAhYXJnRW5kRGF0ZSkgdGhyb3cgXCJ0aGUgcGFyYW1ldGVycyBhcmdCZWdpbkRhdGUgYW5kIGFyZ0VuZERhdGUgYXJlIG1hbmRhdG9yeSBpbiBnZXRUaW1lU2VyaWVzQmV0d2VlbkRhdGVzIE1ldGhvZCAhXCI7XG5cbiAgICB2YXIgdGltZVMgPSBbXTtcbiAgICB2YXIgYmVnaW4gPSBuZXcgRGF0ZShhcmdCZWdpbkRhdGUpLmdldFRpbWUoKTtcbiAgICB2YXIgZW5kID0gbmV3IERhdGUoYXJnRW5kRGF0ZSkuZ2V0VGltZSgpO1xuXG4gICAgaWYgKGJlZ2luID4gZW5kKSBiZWdpbiA9IFtlbmQsIChlbmQgPSBiZWdpbildWzBdOyAvL3N3YXAgYmVnaW4gYW5kIGVuZCBpZiBlbmQgPCBiZWdpblxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkID0gdGhpcy5kYXRhW2ldO1xuICAgICAgdmFyIGRhdGVUb01zID0gbmV3IERhdGUoZC5kYXRlLmdldCgpKS5nZXRUaW1lKCk7XG4gICAgICBpZiAoZGF0ZVRvTXMgPj0gYmVnaW4gJiYgZGF0ZVRvTXMgPD0gZW5kKSB7XG4gICAgICAgIHRpbWVTLnB1c2goZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRpbWVTO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqSXQgVGFrZXMgYSBkYXRlIGFzIHBhcmFtcyBhbmQgcmV0dXJuIHRoZSBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBkYXRlLFxuICAgKml0IHJldHVybnMgYW4gZW1wdHkgb2JqZWN0IGlmIG5vIGRhdGEgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBkYXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZX0gYXJnRGF0ZSAtIE11c3QgYmUgYSBkYXRlIGluIG1pbGlzZWNvbmQgb3IgaW4geWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzIGZvcm1hdCBcbiAgICogQHJldHVybnMge09iamVjdH0gcmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZGF0ZSBhbmQgZGF0YSBjb3JyZXNwb25kaW5nIHRvIGFyZ0RhdGVcbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFzeW5jIGdldERhdGVWYWx1ZShhcmdEYXRlKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShhcmdEYXRlKS5nZXRUaW1lKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHQgPSBuZXcgRGF0ZSh0aGlzLmRhdGFbaV0uZGF0ZS5nZXQoKSkuZ2V0VGltZSgpO1xuICAgICAgaWYgKHQgPT0gZGF0ZSkgcmV0dXJuIHRoaXMuZGF0YVtpXS5kYXRlO1xuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogSXQgdGFrZXMgYSBkYXRlIGFzIGEgcGFyYW1zIGFuZCByZW1vdmUgYW5kIHJldHVybnMgdGhlIGRhdGEgY29ycmVzcG9uZGluZyB0byB0aGlzIGRhdGVcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlfSBkYXRlVG9SZW1vdmUgLSBNdXN0IGJlIGEgZGF0ZSBpbiBtaWxpc2Vjb25kIG9yIGluIHllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kcyBmb3JtYXQgXG4gICAqIEByZXR1cm5zIHtPYmplY3R8dW5kZWZpbmVkfSByZXR1cm5zIHRoZSBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBkYXRlLCByZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBkYXRhIGZvdW5kLlxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgcmVtb3ZlRGF0ZShkYXRlVG9SZW1vdmUpIHtcbiAgICB2YXIgZCA9IG5ldyBEYXRlKGRhdGVUb1JlbW92ZSkuZ2V0RGF0ZSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmRhdGFbaV0uZGF0ZS5nZXQoKSA9PSBkYXRlVG9SZW1vdmUpIHtcbiAgICAgICAgdmFyIGRhdGVSZW1vdmVkID0gdGhpcy5kYXRhW2ldO1xuICAgICAgICB0aGlzLmRhdGEuc3BsaWNlKGksIDApO1xuICAgICAgICByZXR1cm4gZGF0ZVJlbW92ZWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKioqIEZvbmN0aW9uIG5vbiB1dGlsaXPDqWVzIHBhciBsJ3V0aWxpc2F0ZXVyICovXG4gIGFzeW5jIGFkZERhdGVUb1RpbWVTZXJpZXNBcmNoaXZlKGFyZ0RhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5hcmNoaXZlLmxvYWQoZWwgPT4ge1xuICAgICAgZWwucHVzaChhcmdEYXRlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiB0aGlzIGZ1bmN0aW9uIHRha2VzIGFzIHBhcmFtZXRlcnMgdHdvIGRhdGUgKG9uZSBvcHRpb25hbCksXG4gICAqIGlmIGJvdGggZGF0ZXMgYXJlIGdpdmVuIGl0IGFyY2hpdmVzIGFsbCBkYXRlIGJldHdlZW4gYm90aCAodGhleSBldmVuIGluY2x1ZGVkKVxuICAgKiBlbHNlIGl0IGFyY2hpdmVzIHRoZSBkYXRlIGdpdmVuXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZX0gYmVnaW5EYXRlIC0gTXVzdCBiZSBhIGRhdGUgaW4gbWlsaXNlY29uZCBvciBpbiB5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHMgZm9ybWF0IFxuICAgKiBAcGFyYW0ge0RhdGV9IFtlbmREYXRlPXVuZGVmaW5lZF0gLSBPcHRpb25hbCwgbXVzdCBiZSBhIGRhdGUgaW4gbWlsaXNlY29uZCBvciBpbiB5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHMgZm9ybWF0XG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBhcmNoaXZlRGF0ZShiZWdpbkRhdGUsIGVuZERhdGUgPSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZGF0ZVRvQXJjaGl2ZSA9IFtdO1xuXG4gICAgaWYgKCFlbmREYXRlKSB7XG4gICAgICB2YXIgZCA9IGF3YWl0IHRoaXMuZ2V0RGF0ZVZhbHVlKGJlZ2luRGF0ZSk7XG4gICAgICBkYXRlVG9BcmNoaXZlLnB1c2goZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGVUb0FyY2hpdmUgPSBhd2FpdCB0aGlzLmdldFRpbWVTZXJpZXNCZXR3ZWVuRGF0ZXMoYmVnaW5EYXRlLFxuICAgICAgICBlbmREYXRlKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGVUb0FyY2hpdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkYXRlQXJjaGl2ZWQgPSBhd2FpdCB0aGlzLnJlbW92ZURhdGUoZGF0ZVRvQXJjaGl2ZVtpXSk7XG4gICAgICBpZiAoZGF0ZUFyY2hpdmVkKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYWRkRGF0ZVRvVGltZVNlcmllc0FyY2hpdmUoZGF0ZUFyY2hpdmVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogdGhpcyBmdW5jdGlvbiBhbGxvd3MgdG8gZ2V0IGFsbCBkYXRhIGFyY2hpdmVkLCBpdCByZXR1cm5zIGEgUHJvbWlzZVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gYSBwcm9taXNlIG9mIGFsbCBhcmNoaXZlZCBkYXRhXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBnZXREYXRlQXJjaGl2ZWQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuYXJjaGl2ZS5sb2FkKGVsID0+IHtcbiAgICAgICAgcmVzb2x2ZShlbCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKnRoaXMgZnVuY3Rpb24gYWxsb3dzIHRvIGFyY2hpdmUgdGhlIGRhdGEgb2YgdGhlIHRpbWVTZXJpZXMsIGJ5IGNoYW5naW5nIHRoZSBhdHRyaWJ1dGUgYXJjaGl2ZVRpbWUgeW91IGNoYW5nZSB0aGUgYXJjaGl2aW5nIGZyZXF1ZW5jeS5cbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFyY2hpdmVEYXRhUGVyRGF5KCkge1xuICAgIHZhciBiZWdpbiA9IERhdGUubm93KCk7XG4gICAgdmFyIGVuZDtcbiAgICB2YXIgc2Vjb25kZXNQZXJEYXkgPSAzNjAwICogdGhpcy5hcmNoaXZlVGltZS5nZXQoKTtcblxuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGVuZCA9IERhdGUubm93KCk7XG4gICAgICB0aGlzLmFyY2hpdmVEYXRlKGJlZ2luLCBlbmQpO1xuICAgIH0sIHNlY29uZGVzUGVyRGF5ICogMTAwMCk7XG4gIH1cblxuICAvKioqKiBDZXR0ZSBmb25jdGlvbiBuZSBkb2lzIHBhcyDDqnRyZSB1dGlsaXPDqWUgcGFyIGwndXRpbGlzYXRldXIgKi9cbiAgZm9ybWF0RGF0ZSgpIHtcbiAgICB2YXIgdCA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIChcbiAgICAgIHQuZ2V0RnVsbFllYXIoKSArXG4gICAgICBcIi1cIiArXG4gICAgICAodC5nZXRNb250aCgpICsgMSkgK1xuICAgICAgXCItXCIgK1xuICAgICAgdC5nZXREYXRlKCkgK1xuICAgICAgXCIgXCIgK1xuICAgICAgdC5nZXRIb3VycygpICtcbiAgICAgIFwiOlwiICtcbiAgICAgIHQuZ2V0TWludXRlcygpICtcbiAgICAgIFwiOlwiICtcbiAgICAgIHQuZ2V0U2Vjb25kcygpXG4gICAgKTtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgVGltZVNlcmllcztcbnNwaW5hbENvcmUucmVnaXN0ZXJfbW9kZWxzKFtUaW1lU2VyaWVzXSk7Il19