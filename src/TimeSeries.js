const spinalCore = require("spinal-core-connectorjs");
const globalType = typeof window === "undefined" ? global : window;
import {
  Utilities
} from "./Utilities";

import TimeSeriesData from "./TimeSeriesData";

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
  constructor(
    _name = "TimeSeries",
    archiveTime = 24,
    frequency = 5,
    data = new Lst(),
    name = "TimeSeries"
  ) {
    super();
    if (FileSystem._sig_server) {
      this.add_attr({
        id: Utilities.guid(this.constructor.name),
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
  async addToTimeSeries(value) {
    if (typeof value === "undefined") throw "the parameter value is mandatory in addToTimeSeries Method !"

    var timeS = new TimeSeriesData(new Date(date).getTime(), value);
    this.data.push(timeS);
  }

  /**
   *
   *
   * @returns {Object} returns an object that contains the date and value of current timeSeries
   * @memberof TimeSeries
   */
  async getTimeSeriesCurrentValue() {
    return this.data[this.data.length - 1];
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
  async getTimeSeriesBetweenDates(argBeginDate, argEndDate) {

    if (!argBeginDate || !argEndDate) throw "the parameters argBeginDate and argEndDate are mandatory in getTimeSeriesBetweenDates Method !";

    var timeS = [];
    var begin = new Date(argBeginDate).getTime();
    var end = new Date(argEndDate).getTime();

    if (begin > end) begin = [end, (end = begin)][0]; //swap begin and end if end < begin

    for (var i = 0; i < this.data.length; i++) {
      var d = this.data[i];
      var dateToMs = new Date(d.date.get()).getTime();

      if (dateToMs >= begin && dateToMs <= end) {
        timeS.push(d);
      }
    }

    return timeS;
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
  async getDateValue(argDate) {
    var date = new Date(argDate).getTime();

    for (var i = 0; i < this.data.length; i++) {
      var t = new Date(this.data[i].date.get()).getTime();
      if (t == date) return this.data[i];
    }
    return {};
  }

  /**
   *
   * It takes a date as a params and remove and returns the data corresponding to this date
   *
   * @param {Date} dateToRemove - Must be a date in milisecond or in year-month-day hours:minutes:seconds format 
   * @returns {Object|undefined} returns the data corresponding to this date, returns undefined if no data found.
   * @memberof TimeSeries
   */
  async removeDate(dateToRemove) {
    var d = new Date(dateToRemove).getTime();
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].date.get() == d) {
        var dateRemoved = this.data[i];
        this.data.splice(i, 1);
        return dateRemoved;
      }
    }

    return undefined;
  }

  /**** Fonction non utilisées par l'utilisateur */
  async addDateToTimeSeriesArchive(argDate) {
    return this.archive.load(el => {
      el.push(argDate);
    });
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
  async archiveDate(beginDate, endDate = undefined) {
    var dateToArchive = [];

    if (!endDate) {
      var d = await this.getDateValue(beginDate);
      dateToArchive.push(d);
    } else {
      dateToArchive = await this.getTimeSeriesBetweenDates(beginDate,
        endDate);
    }


    for (var i = 0; i < dateToArchive.length; i++) {
      var dateArchived = await this.removeDate(dateToArchive[i].date.get());
      if (dateArchived) {
        await this.addDateToTimeSeriesArchive(dateArchived);
      }
    }
  }

  /**
   *
   * this function allows to get all data archived, it returns a Promise
   *
   * @returns {Promise} a promise of all archived data
   * @memberof TimeSeries
   */
  async getDateArchived() {
    return new Promise((resolve, reject) => {
      this.archive.load(el => {
        resolve(el);
      });
    });
  }

  /**
   *this function allows to archive the data of the timeSeries, by changing the attribute archiveTime you change the archiving frequency.
   * @memberof TimeSeries
   */
  archiveDataPerDay() {
    var begin = Date.now();
    var end;
    var secondesPerDay = 30 //3600 * this.archiveTime.get();

    setInterval(async () => {
      console.log("arhivage!!!");
      end = Date.now();
      await this.archiveDate(begin, end);
      begin = Date.now();
    }, secondesPerDay * 1000);
  }

  /**** Cette fonction ne dois pas être utilisée par l'utilisateur */
  formatDate() {
    var t = new Date();
    return (
      t.getFullYear() +
      "-" +
      (t.getMonth() + 1) +
      "-" +
      t.getDate() +
      " " +
      t.getHours() +
      ":" +
      t.getMinutes() +
      ":" +
      t.getSeconds()
    );
  }
}
export default TimeSeries;
spinalCore.register_models([TimeSeries]);