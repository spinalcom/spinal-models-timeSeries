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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UaW1lU2VyaWVzLmpzIl0sIm5hbWVzIjpbInNwaW5hbENvcmUiLCJyZXF1aXJlIiwiZ2xvYmFsVHlwZSIsIndpbmRvdyIsImdsb2JhbCIsIlRpbWVTZXJpZXMiLCJNb2RlbCIsImNvbnN0cnVjdG9yIiwiX25hbWUiLCJhcmNoaXZlVGltZSIsImZyZXF1ZW5jeSIsImRhdGEiLCJMc3QiLCJuYW1lIiwiRmlsZVN5c3RlbSIsIl9zaWdfc2VydmVyIiwiYWRkX2F0dHIiLCJpZCIsIlV0aWxpdGllcyIsImd1aWQiLCJhcmNoaXZlIiwiUHRyIiwiYWRkVG9UaW1lU2VyaWVzIiwidmFsdWUiLCJ0aW1lUyIsIlRpbWVTZXJpZXNEYXRhIiwiRGF0ZSIsIm5vdyIsInB1c2giLCJnZXRUaW1lU2VyaWVzQ3VycmVudFZhbHVlIiwibGVuZ3RoIiwiZ2V0VGltZVNlcmllc0JldHdlZW5EYXRlcyIsImFyZ0JlZ2luRGF0ZSIsImFyZ0VuZERhdGUiLCJiZWdpbiIsImdldFRpbWUiLCJlbmQiLCJpIiwiZCIsImRhdGVUb01zIiwiZGF0ZSIsImdldCIsImdldERhdGVWYWx1ZSIsImFyZ0RhdGUiLCJ0IiwicmVtb3ZlRGF0ZSIsImRhdGVUb1JlbW92ZSIsImdldERhdGUiLCJkYXRlUmVtb3ZlZCIsInNwbGljZSIsInVuZGVmaW5lZCIsImFkZERhdGVUb1RpbWVTZXJpZXNBcmNoaXZlIiwibG9hZCIsImVsIiwiYXJjaGl2ZURhdGUiLCJiZWdpbkRhdGUiLCJlbmREYXRlIiwiZGF0ZVRvQXJjaGl2ZSIsImRhdGVBcmNoaXZlZCIsImdldERhdGVBcmNoaXZlZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJjaGl2ZURhdGFQZXJEYXkiLCJzZWNvbmRlc1BlckRheSIsInNldEludGVydmFsIiwiZm9ybWF0RGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwicmVnaXN0ZXJfbW9kZWxzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQTs7QUFJQTs7Ozs7Ozs7QUFOQSxNQUFNQSxhQUFhQyxRQUFRLHlCQUFSLENBQW5CO0FBQ0EsTUFBTUMsYUFBYSxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLEdBQWdDQyxNQUFoQyxHQUF5Q0QsTUFBNUQ7OztBQU9BOzs7Ozs7QUFNQSxNQUFNRSxVQUFOLFNBQXlCSCxXQUFXSSxLQUFwQyxDQUEwQztBQUN4Qzs7Ozs7Ozs7Ozs7O0FBWUFDLGNBQ0VDLFFBQVEsWUFEVixFQUVFQyxjQUFjLEVBRmhCLEVBR0VDLFlBQVksQ0FIZCxFQUlFQyxPQUFPLElBQUlDLEdBQUosRUFKVCxFQUtFQyxPQUFPLFlBTFQsRUFNRTtBQUNBO0FBQ0EsUUFBSUMsV0FBV0MsV0FBZixFQUE0QjtBQUMxQixXQUFLQyxRQUFMLENBQWM7QUFDWkMsWUFBSUMscUJBQVVDLElBQVYsQ0FBZSxLQUFLWixXQUFMLENBQWlCTSxJQUFoQyxDQURRO0FBRVpBLGNBQU1MLEtBRk07QUFHWkMscUJBQWFBLFdBSEQ7QUFJWkMsbUJBQVdBLFNBSkM7QUFLWkMsY0FBTUEsSUFMTTtBQU1aUyxpQkFBUyxJQUFJQyxHQUFKLENBQVEsSUFBSVQsR0FBSixFQUFSO0FBTkcsT0FBZDtBQVFEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7QUFPTVUsaUJBQU4sQ0FBc0JDLEtBQXRCLEVBQTZCO0FBQUE7O0FBQUE7QUFDM0IsVUFBSSxPQUFPQSxLQUFQLEtBQWlCLFdBQXJCLEVBQWtDLE1BQU0sOERBQU47O0FBRWxDLFVBQUlDLFFBQVEsSUFBSUMsd0JBQUosQ0FBbUJDLEtBQUtDLEdBQUwsRUFBbkIsRUFBK0JKLEtBQS9CLENBQVo7QUFDQSxZQUFLWixJQUFMLENBQVVpQixJQUFWLENBQWVKLEtBQWY7QUFKMkI7QUFLNUI7O0FBRUQ7Ozs7OztBQU1NSywyQkFBTixHQUFrQztBQUFBOztBQUFBO0FBQ2hDLGFBQU8sT0FBS2xCLElBQUwsQ0FBVSxPQUFLQSxJQUFMLENBQVVtQixNQUFWLEdBQW1CLENBQTdCLENBQVA7QUFEZ0M7QUFFakM7O0FBRUQ7Ozs7Ozs7Ozs7QUFVTUMsMkJBQU4sQ0FBZ0NDLFlBQWhDLEVBQThDQyxVQUE5QyxFQUEwRDtBQUFBOztBQUFBOztBQUV4RCxVQUFJLENBQUNELFlBQUQsSUFBaUIsQ0FBQ0MsVUFBdEIsRUFBa0MsTUFBTSxnR0FBTjs7QUFFbEMsVUFBSVQsUUFBUSxFQUFaO0FBQ0EsVUFBSVUsUUFBUSxJQUFJUixJQUFKLENBQVNNLFlBQVQsRUFBdUJHLE9BQXZCLEVBQVo7QUFDQSxVQUFJQyxNQUFNLElBQUlWLElBQUosQ0FBU08sVUFBVCxFQUFxQkUsT0FBckIsRUFBVjs7QUFFQSxVQUFJRCxRQUFRRSxHQUFaLEVBQWlCRixRQUFRLENBQUNFLEdBQUQsRUFBT0EsTUFBTUYsS0FBYixFQUFxQixDQUFyQixDQUFSLENBUnVDLENBUU47O0FBRWxELFdBQUssSUFBSUcsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLE9BQUsxQixJQUFMLENBQVVtQixNQUE5QixFQUFzQ08sR0FBdEMsRUFBMkM7QUFDekMsWUFBSUMsSUFBSSxPQUFLM0IsSUFBTCxDQUFVMEIsQ0FBVixDQUFSO0FBQ0EsWUFBSUUsV0FBVyxJQUFJYixJQUFKLENBQVNZLEVBQUVFLElBQUYsQ0FBT0MsR0FBUCxFQUFULEVBQXVCTixPQUF2QixFQUFmO0FBQ0EsWUFBSUksWUFBWUwsS0FBWixJQUFxQkssWUFBWUgsR0FBckMsRUFBMEM7QUFDeENaLGdCQUFNSSxJQUFOLENBQVdVLENBQVg7QUFDRDtBQUNGOztBQUVELGFBQU9kLEtBQVA7QUFsQndEO0FBbUJ6RDs7QUFFRDs7Ozs7Ozs7OztBQVVNa0IsY0FBTixDQUFtQkMsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQTtBQUMxQixVQUFJSCxPQUFPLElBQUlkLElBQUosQ0FBU2lCLE9BQVQsRUFBa0JSLE9BQWxCLEVBQVg7O0FBRUEsV0FBSyxJQUFJRSxJQUFJLENBQWIsRUFBZ0JBLElBQUksT0FBSzFCLElBQUwsQ0FBVW1CLE1BQTlCLEVBQXNDTyxHQUF0QyxFQUEyQztBQUN6QyxZQUFJTyxJQUFJLElBQUlsQixJQUFKLENBQVMsT0FBS2YsSUFBTCxDQUFVMEIsQ0FBVixFQUFhRyxJQUFiLENBQWtCQyxHQUFsQixFQUFULEVBQWtDTixPQUFsQyxFQUFSO0FBQ0EsWUFBSVMsS0FBS0osSUFBVCxFQUFlLE9BQU8sT0FBSzdCLElBQUwsQ0FBVTBCLENBQVYsRUFBYUcsSUFBcEI7QUFDaEI7QUFDRCxhQUFPLEVBQVA7QUFQMEI7QUFRM0I7O0FBRUQ7Ozs7Ozs7O0FBUU1LLFlBQU4sQ0FBaUJDLFlBQWpCLEVBQStCO0FBQUE7O0FBQUE7QUFDN0IsVUFBSVIsSUFBSSxJQUFJWixJQUFKLENBQVNvQixZQUFULEVBQXVCQyxPQUF2QixFQUFSOztBQUVBLFdBQUssSUFBSVYsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLE9BQUsxQixJQUFMLENBQVVtQixNQUE5QixFQUFzQ08sR0FBdEMsRUFBMkM7QUFDekMsWUFBSSxPQUFLMUIsSUFBTCxDQUFVMEIsQ0FBVixFQUFhRyxJQUFiLENBQWtCQyxHQUFsQixNQUEyQkssWUFBL0IsRUFBNkM7QUFDM0MsY0FBSUUsY0FBYyxPQUFLckMsSUFBTCxDQUFVMEIsQ0FBVixDQUFsQjtBQUNBLGlCQUFLMUIsSUFBTCxDQUFVc0MsTUFBVixDQUFpQlosQ0FBakIsRUFBb0IsQ0FBcEI7QUFDQSxpQkFBT1csV0FBUDtBQUNEO0FBQ0Y7O0FBRUQsYUFBT0UsU0FBUDtBQVg2QjtBQVk5Qjs7QUFFRDtBQUNNQyw0QkFBTixDQUFpQ1IsT0FBakMsRUFBMEM7QUFBQTs7QUFBQTtBQUN4QyxhQUFPLE9BQUt2QixPQUFMLENBQWFnQyxJQUFiLENBQWtCLGNBQU07QUFDN0JDLFdBQUd6QixJQUFILENBQVFlLE9BQVI7QUFDRCxPQUZNLENBQVA7QUFEd0M7QUFJekM7O0FBRUQ7Ozs7Ozs7Ozs7QUFVTVcsYUFBTixDQUFrQkMsU0FBbEIsRUFBNkJDLFVBQVVOLFNBQXZDLEVBQWtEO0FBQUE7O0FBQUE7QUFDaEQsVUFBSU8sZ0JBQWdCLEVBQXBCOztBQUVBLFVBQUksQ0FBQ0QsT0FBTCxFQUFjO0FBQ1osWUFBSWxCLElBQUksTUFBTSxPQUFLSSxZQUFMLENBQWtCYSxTQUFsQixDQUFkO0FBQ0FFLHNCQUFjN0IsSUFBZCxDQUFtQlUsQ0FBbkI7QUFDRCxPQUhELE1BR087QUFDTG1CLHdCQUFnQixNQUFNLE9BQUsxQix5QkFBTCxDQUErQndCLFNBQS9CLEVBQ3BCQyxPQURvQixDQUF0QjtBQUVEOztBQUVELFdBQUssSUFBSW5CLElBQUksQ0FBYixFQUFnQkEsSUFBSW9CLGNBQWMzQixNQUFsQyxFQUEwQ08sR0FBMUMsRUFBK0M7QUFDN0MsWUFBSXFCLGVBQWUsTUFBTSxPQUFLYixVQUFMLENBQWdCWSxjQUFjcEIsQ0FBZCxDQUFoQixDQUF6QjtBQUNBLFlBQUlxQixZQUFKLEVBQWtCO0FBQ2hCLGdCQUFNLE9BQUtQLDBCQUFMLENBQWdDTyxZQUFoQyxDQUFOO0FBQ0Q7QUFDRjtBQWhCK0M7QUFpQmpEOztBQUVEOzs7Ozs7O0FBT01DLGlCQUFOLEdBQXdCO0FBQUE7O0FBQUE7QUFDdEIsYUFBTyxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLGVBQUsxQyxPQUFMLENBQWFnQyxJQUFiLENBQWtCLGNBQU07QUFDdEJTLGtCQUFRUixFQUFSO0FBQ0QsU0FGRDtBQUdELE9BSk0sQ0FBUDtBQURzQjtBQU12Qjs7QUFFRDs7OztBQUlBVSxzQkFBb0I7QUFDbEIsUUFBSTdCLFFBQVFSLEtBQUtDLEdBQUwsRUFBWjtBQUNBLFFBQUlTLEdBQUo7QUFDQSxRQUFJNEIsaUJBQWlCLE9BQU8sS0FBS3ZELFdBQUwsQ0FBaUJnQyxHQUFqQixFQUE1Qjs7QUFFQXdCLGdCQUFZLE1BQU07QUFDaEI3QixZQUFNVixLQUFLQyxHQUFMLEVBQU47QUFDQSxXQUFLMkIsV0FBTCxDQUFpQnBCLEtBQWpCLEVBQXdCRSxHQUF4QjtBQUNELEtBSEQsRUFHRzRCLGlCQUFpQixJQUhwQjtBQUlEOztBQUVEO0FBQ0FFLGVBQWE7QUFDWCxRQUFJdEIsSUFBSSxJQUFJbEIsSUFBSixFQUFSO0FBQ0EsV0FDRWtCLEVBQUV1QixXQUFGLEtBQ0EsR0FEQSxJQUVDdkIsRUFBRXdCLFFBQUYsS0FBZSxDQUZoQixJQUdBLEdBSEEsR0FJQXhCLEVBQUVHLE9BQUYsRUFKQSxHQUtBLEdBTEEsR0FNQUgsRUFBRXlCLFFBQUYsRUFOQSxHQU9BLEdBUEEsR0FRQXpCLEVBQUUwQixVQUFGLEVBUkEsR0FTQSxHQVRBLEdBVUExQixFQUFFMkIsVUFBRixFQVhGO0FBYUQ7QUFwTnVDO2tCQXNOM0JsRSxVOztBQUNmTCxXQUFXd0UsZUFBWCxDQUEyQixDQUFDbkUsVUFBRCxDQUEzQiIsImZpbGUiOiJUaW1lU2VyaWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc3BpbmFsQ29yZSA9IHJlcXVpcmUoXCJzcGluYWwtY29yZS1jb25uZWN0b3Jqc1wiKTtcbmNvbnN0IGdsb2JhbFR5cGUgPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogd2luZG93O1xuaW1wb3J0IHtcbiAgVXRpbGl0aWVzXG59IGZyb20gXCIuL1V0aWxpdGllc1wiO1xuXG5pbXBvcnQgVGltZVNlcmllc0RhdGEgZnJvbSBcIi4vVGltZVNlcmllc0RhdGFcIjtcblxuLyoqXG4gKlxuICpcbiAqIEBjbGFzcyBUaW1lU2VyaWVzXG4gKiBAZXh0ZW5kcyB7TW9kZWx9XG4gKi9cbmNsYXNzIFRpbWVTZXJpZXMgZXh0ZW5kcyBnbG9iYWxUeXBlLk1vZGVsIHtcbiAgLyoqXG4gICAqQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBUaW1lU2VyaWVzLlxuICAgKkl0IHRha2VzIGFzIHBhcmFtZXRlcnMgdGhlIG5hbWUgb2YgdGhlIHRpbWVTZXJpZXMgKF9uYW1lKSBhIHN0cmluZyxcbiAgICp0aGUgbnVtYmVyIG9mIGhvdXJzIGR1cmluZyB3aGljaCB0aGUgZGF0YSBpcyBzYXZlZCwgYWZ0ZXIgdGhhdCB0aGUgZGF0YSBpcyBhcmNoaXZlZFxuICAgKmEgZnJlcXVlbmN5IChmcmVxdWVuY3kpIG9mIGFkZGluZyBkYXRhIGluIHNlY29uZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbX25hbWU9VGltZVNlcmllc10gLSBUaW1lU2VyaWVzIG5hbWVcbiAgICogQHBhcmFtIHtudW1iZXJ9IFthcmNoaXZlVGltZT0yNF0gLSBpbiBob3Vyc1xuICAgKiBAcGFyYW0ge251bWJlcn0gW2ZyZXF1ZW5jeT01XSAtIGluIHNlY29uZFxuICAgKiBAcGFyYW0ge0xzdH0gW2RhdGE9bmV3IExzdCgpXSAtIHRpbWVTZXJpZXMgRGF0YVxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgX25hbWUgPSBcIlRpbWVTZXJpZXNcIixcbiAgICBhcmNoaXZlVGltZSA9IDI0LFxuICAgIGZyZXF1ZW5jeSA9IDUsXG4gICAgZGF0YSA9IG5ldyBMc3QoKSxcbiAgICBuYW1lID0gXCJUaW1lU2VyaWVzXCJcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICBpZiAoRmlsZVN5c3RlbS5fc2lnX3NlcnZlcikge1xuICAgICAgdGhpcy5hZGRfYXR0cih7XG4gICAgICAgIGlkOiBVdGlsaXRpZXMuZ3VpZCh0aGlzLmNvbnN0cnVjdG9yLm5hbWUpLFxuICAgICAgICBuYW1lOiBfbmFtZSxcbiAgICAgICAgYXJjaGl2ZVRpbWU6IGFyY2hpdmVUaW1lLFxuICAgICAgICBmcmVxdWVuY3k6IGZyZXF1ZW5jeSxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgYXJjaGl2ZTogbmV3IFB0cihuZXcgTHN0KCkpXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICp0YWtlcyBhcyBwYXJhbWV0ZXIgYSBudW1iZXIgKGRhdGEgdG8gc2F2ZSApIGFuZCBzYXZlcyBhbiBvYmplY3Qgb2YgdHlwZSB7ZGF0ZTogc2F2ZURhdGUsIHZhbHVlOiBkYXRhVG9TYXZlfSBpbiB0aW1lU2VyaWVzIGRhdGFcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gVmFsdWUgVG8gU2F2ZSAobWFuZGF0b3J5KVxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgYWRkVG9UaW1lU2VyaWVzKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikgdGhyb3cgXCJ0aGUgcGFyYW1ldGVyIHZhbHVlIGlzIG1hbmRhdG9yeSBpbiBhZGRUb1RpbWVTZXJpZXMgTWV0aG9kICFcIlxuXG4gICAgdmFyIHRpbWVTID0gbmV3IFRpbWVTZXJpZXNEYXRhKERhdGUubm93KCksIHZhbHVlKTtcbiAgICB0aGlzLmRhdGEucHVzaCh0aW1lUyk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gcmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZGF0ZSBhbmQgdmFsdWUgb2YgY3VycmVudCB0aW1lU2VyaWVzXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyBnZXRUaW1lU2VyaWVzQ3VycmVudFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqVGFrZXMgYXMgcGFyYW1ldGVycyB0d28gZGF0ZXMgKGluIG1pbGxpc2Vjb25kIG9yIGEgZGF0ZSBzdHJpbmcgaW4gYSB2YWxpZCBmb3JtYXQsIHByZWZlcmFibHkgXCJ5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHNcIiBmb3IgZXhhbXBsZSA6IDIwMTgtMTAtMjUgMTY6MjY6MzAgKVxuICAgKmFuZCByZXR1cm5zIGEgQXJyYXkgb2YgYWxsIHRpbWVTZXJpZXMgYmV0d2VlbiB0aGUgdHdvIGRhdGVzXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZX0gYXJnQmVnaW5EYXRlIC0gTXVzdCBiZSBhIGRhdGUgaW4gbWlsaXNlY29uZCBvciBpbiB5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHMgZm9ybWF0IFxuICAgKiBAcGFyYW0ge0RhdGV9IGFyZ0VuZERhdGUgLSB0aGUgbGFzdCBkYXRlIGluIG1pbGlzZWNvbmQgb3IgaW4geWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzIGZvcm1hdCBcbiAgICogQHJldHVybnMge0FycmF5fSBBcnJheSBvZiBhbGwgdGltZVNlcmllcyBiZXR3ZWVuIGFyZ0JlZ2luRGF0ZSBhbmQgYXJnRW5kRGF0ZVxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgZ2V0VGltZVNlcmllc0JldHdlZW5EYXRlcyhhcmdCZWdpbkRhdGUsIGFyZ0VuZERhdGUpIHtcblxuICAgIGlmICghYXJnQmVnaW5EYXRlIHx8ICFhcmdFbmREYXRlKSB0aHJvdyBcInRoZSBwYXJhbWV0ZXJzIGFyZ0JlZ2luRGF0ZSBhbmQgYXJnRW5kRGF0ZSBhcmUgbWFuZGF0b3J5IGluIGdldFRpbWVTZXJpZXNCZXR3ZWVuRGF0ZXMgTWV0aG9kICFcIjtcblxuICAgIHZhciB0aW1lUyA9IFtdO1xuICAgIHZhciBiZWdpbiA9IG5ldyBEYXRlKGFyZ0JlZ2luRGF0ZSkuZ2V0VGltZSgpO1xuICAgIHZhciBlbmQgPSBuZXcgRGF0ZShhcmdFbmREYXRlKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAoYmVnaW4gPiBlbmQpIGJlZ2luID0gW2VuZCwgKGVuZCA9IGJlZ2luKV1bMF07IC8vc3dhcCBiZWdpbiBhbmQgZW5kIGlmIGVuZCA8IGJlZ2luXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGQgPSB0aGlzLmRhdGFbaV07XG4gICAgICB2YXIgZGF0ZVRvTXMgPSBuZXcgRGF0ZShkLmRhdGUuZ2V0KCkpLmdldFRpbWUoKTtcbiAgICAgIGlmIChkYXRlVG9NcyA+PSBiZWdpbiAmJiBkYXRlVG9NcyA8PSBlbmQpIHtcbiAgICAgICAgdGltZVMucHVzaChkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGltZVM7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICpJdCBUYWtlcyBhIGRhdGUgYXMgcGFyYW1zIGFuZCByZXR1cm4gdGhlIGRhdGEgY29ycmVzcG9uZGluZyB0byB0aGlzIGRhdGUsXG4gICAqaXQgcmV0dXJucyBhbiBlbXB0eSBvYmplY3QgaWYgbm8gZGF0YSBpcyBhc3NvY2lhdGVkIHdpdGggdGhlIGRhdGVcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlfSBhcmdEYXRlIC0gTXVzdCBiZSBhIGRhdGUgaW4gbWlsaXNlY29uZCBvciBpbiB5ZWFyLW1vbnRoLWRheSBob3VyczptaW51dGVzOnNlY29uZHMgZm9ybWF0IFxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSByZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBkYXRlIGFuZCBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gYXJnRGF0ZVxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXN5bmMgZ2V0RGF0ZVZhbHVlKGFyZ0RhdGUpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGFyZ0RhdGUpLmdldFRpbWUoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdCA9IG5ldyBEYXRlKHRoaXMuZGF0YVtpXS5kYXRlLmdldCgpKS5nZXRUaW1lKCk7XG4gICAgICBpZiAodCA9PSBkYXRlKSByZXR1cm4gdGhpcy5kYXRhW2ldLmRhdGU7XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBJdCB0YWtlcyBhIGRhdGUgYXMgYSBwYXJhbXMgYW5kIHJlbW92ZSBhbmQgcmV0dXJucyB0aGUgZGF0YSBjb3JyZXNwb25kaW5nIHRvIHRoaXMgZGF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVUb1JlbW92ZSAtIE11c3QgYmUgYSBkYXRlIGluIG1pbGlzZWNvbmQgb3IgaW4geWVhci1tb250aC1kYXkgaG91cnM6bWludXRlczpzZWNvbmRzIGZvcm1hdCBcbiAgICogQHJldHVybnMge09iamVjdHx1bmRlZmluZWR9IHJldHVybnMgdGhlIGRhdGEgY29ycmVzcG9uZGluZyB0byB0aGlzIGRhdGUsIHJldHVybnMgdW5kZWZpbmVkIGlmIG5vIGRhdGEgZm91bmQuXG4gICAqIEBtZW1iZXJvZiBUaW1lU2VyaWVzXG4gICAqL1xuICBhc3luYyByZW1vdmVEYXRlKGRhdGVUb1JlbW92ZSkge1xuICAgIHZhciBkID0gbmV3IERhdGUoZGF0ZVRvUmVtb3ZlKS5nZXREYXRlKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMuZGF0YVtpXS5kYXRlLmdldCgpID09IGRhdGVUb1JlbW92ZSkge1xuICAgICAgICB2YXIgZGF0ZVJlbW92ZWQgPSB0aGlzLmRhdGFbaV07XG4gICAgICAgIHRoaXMuZGF0YS5zcGxpY2UoaSwgMCk7XG4gICAgICAgIHJldHVybiBkYXRlUmVtb3ZlZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqKiogRm9uY3Rpb24gbm9uIHV0aWxpc8OpZXMgcGFyIGwndXRpbGlzYXRldXIgKi9cbiAgYXN5bmMgYWRkRGF0ZVRvVGltZVNlcmllc0FyY2hpdmUoYXJnRGF0ZSkge1xuICAgIHJldHVybiB0aGlzLmFyY2hpdmUubG9hZChlbCA9PiB7XG4gICAgICBlbC5wdXNoKGFyZ0RhdGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIHRoaXMgZnVuY3Rpb24gdGFrZXMgYXMgcGFyYW1ldGVycyB0d28gZGF0ZSAob25lIG9wdGlvbmFsKSxcbiAgICogaWYgYm90aCBkYXRlcyBhcmUgZ2l2ZW4gaXQgYXJjaGl2ZXMgYWxsIGRhdGUgYmV0d2VlbiBib3RoICh0aGV5IGV2ZW4gaW5jbHVkZWQpXG4gICAqIGVsc2UgaXQgYXJjaGl2ZXMgdGhlIGRhdGUgZ2l2ZW5cbiAgICpcbiAgICogQHBhcmFtIHtEYXRlfSBiZWdpbkRhdGUgLSBNdXN0IGJlIGEgZGF0ZSBpbiBtaWxpc2Vjb25kIG9yIGluIHllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kcyBmb3JtYXQgXG4gICAqIEBwYXJhbSB7RGF0ZX0gW2VuZERhdGU9dW5kZWZpbmVkXSAtIE9wdGlvbmFsLCBtdXN0IGJlIGEgZGF0ZSBpbiBtaWxpc2Vjb25kIG9yIGluIHllYXItbW9udGgtZGF5IGhvdXJzOm1pbnV0ZXM6c2Vjb25kcyBmb3JtYXRcbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFzeW5jIGFyY2hpdmVEYXRlKGJlZ2luRGF0ZSwgZW5kRGF0ZSA9IHVuZGVmaW5lZCkge1xuICAgIHZhciBkYXRlVG9BcmNoaXZlID0gW107XG5cbiAgICBpZiAoIWVuZERhdGUpIHtcbiAgICAgIHZhciBkID0gYXdhaXQgdGhpcy5nZXREYXRlVmFsdWUoYmVnaW5EYXRlKTtcbiAgICAgIGRhdGVUb0FyY2hpdmUucHVzaChkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0ZVRvQXJjaGl2ZSA9IGF3YWl0IHRoaXMuZ2V0VGltZVNlcmllc0JldHdlZW5EYXRlcyhiZWdpbkRhdGUsXG4gICAgICAgIGVuZERhdGUpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0ZVRvQXJjaGl2ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRhdGVBcmNoaXZlZCA9IGF3YWl0IHRoaXMucmVtb3ZlRGF0ZShkYXRlVG9BcmNoaXZlW2ldKTtcbiAgICAgIGlmIChkYXRlQXJjaGl2ZWQpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hZGREYXRlVG9UaW1lU2VyaWVzQXJjaGl2ZShkYXRlQXJjaGl2ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiB0aGlzIGZ1bmN0aW9uIGFsbG93cyB0byBnZXQgYWxsIGRhdGEgYXJjaGl2ZWQsIGl0IHJldHVybnMgYSBQcm9taXNlXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBhIHByb21pc2Ugb2YgYWxsIGFyY2hpdmVkIGRhdGFcbiAgICogQG1lbWJlcm9mIFRpbWVTZXJpZXNcbiAgICovXG4gIGFzeW5jIGdldERhdGVBcmNoaXZlZCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5hcmNoaXZlLmxvYWQoZWwgPT4ge1xuICAgICAgICByZXNvbHZlKGVsKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqdGhpcyBmdW5jdGlvbiBhbGxvd3MgdG8gYXJjaGl2ZSB0aGUgZGF0YSBvZiB0aGUgdGltZVNlcmllcywgYnkgY2hhbmdpbmcgdGhlIGF0dHJpYnV0ZSBhcmNoaXZlVGltZSB5b3UgY2hhbmdlIHRoZSBhcmNoaXZpbmcgZnJlcXVlbmN5LlxuICAgKiBAbWVtYmVyb2YgVGltZVNlcmllc1xuICAgKi9cbiAgYXJjaGl2ZURhdGFQZXJEYXkoKSB7XG4gICAgdmFyIGJlZ2luID0gRGF0ZS5ub3coKTtcbiAgICB2YXIgZW5kO1xuICAgIHZhciBzZWNvbmRlc1BlckRheSA9IDM2MDAgKiB0aGlzLmFyY2hpdmVUaW1lLmdldCgpO1xuXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgZW5kID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuYXJjaGl2ZURhdGUoYmVnaW4sIGVuZCk7XG4gICAgfSwgc2Vjb25kZXNQZXJEYXkgKiAxMDAwKTtcbiAgfVxuXG4gIC8qKioqIENldHRlIGZvbmN0aW9uIG5lIGRvaXMgcGFzIMOqdHJlIHV0aWxpc8OpZSBwYXIgbCd1dGlsaXNhdGV1ciAqL1xuICBmb3JtYXREYXRlKCkge1xuICAgIHZhciB0ID0gbmV3IERhdGUoKTtcbiAgICByZXR1cm4gKFxuICAgICAgdC5nZXRGdWxsWWVhcigpICtcbiAgICAgIFwiLVwiICtcbiAgICAgICh0LmdldE1vbnRoKCkgKyAxKSArXG4gICAgICBcIi1cIiArXG4gICAgICB0LmdldERhdGUoKSArXG4gICAgICBcIiBcIiArXG4gICAgICB0LmdldEhvdXJzKCkgK1xuICAgICAgXCI6XCIgK1xuICAgICAgdC5nZXRNaW51dGVzKCkgK1xuICAgICAgXCI6XCIgK1xuICAgICAgdC5nZXRTZWNvbmRzKClcbiAgICApO1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBUaW1lU2VyaWVzO1xuc3BpbmFsQ29yZS5yZWdpc3Rlcl9tb2RlbHMoW1RpbWVTZXJpZXNdKTsiXX0=