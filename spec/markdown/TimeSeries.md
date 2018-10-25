<a name="TimeSeries"></a>

## TimeSeries ⇐ <code>Model</code>
**Kind**: global class  
**Extends**: <code>Model</code>  

* [TimeSeries](#TimeSeries) ⇐ <code>Model</code>
    * _instance_
        * [.addToTimeSeries(value)](#TimeSeries+addToTimeSeries)
        * [.getTimeSeriesCurrentValue()](#TimeSeries+getTimeSeriesCurrentValue) ⇒ <code>Object</code>
        * [.getTimeSeriesBetweenDates(argBeginDate, argEndDate)](#TimeSeries+getTimeSeriesBetweenDates) ⇒ <code>Array</code>
        * [.getDateValue(argDate)](#TimeSeries+getDateValue) ⇒ <code>Object</code>
        * [.removeDate(dateToRemove)](#TimeSeries+removeDate) ⇒ <code>Object</code> \| <code>undefined</code>
        * [.archiveDate(beginDate, [endDate])](#TimeSeries+archiveDate)
        * [.getDateArchived()](#TimeSeries+getDateArchived) ⇒ <code>Promise</code>
        * [.archiveDataPerDay()](#TimeSeries+archiveDataPerDay)
    * _static_
        * [.TimeSeries](#TimeSeries.TimeSeries)
            * [new TimeSeries([_name], [archiveTime], [frequency], [data])](#new_TimeSeries.TimeSeries_new)

<a name="TimeSeries+addToTimeSeries"></a>

### timeSeries.addToTimeSeries(value)
takes as parameter a number (data to save ) and saves an object of type {date: saveDate, value: dataToSave} in timeSeries data

**Kind**: instance method of [<code>TimeSeries</code>](#TimeSeries)  

| Param | Type |
| --- | --- |
| value | <code>number</code> | 

<a name="TimeSeries+getTimeSeriesCurrentValue"></a>

### timeSeries.getTimeSeriesCurrentValue() ⇒ <code>Object</code>
**Kind**: instance method of [<code>TimeSeries</code>](#TimeSeries)  
**Returns**: <code>Object</code> - returns an object that contains the date and value of current timeSeries  
<a name="TimeSeries+getTimeSeriesBetweenDates"></a>

### timeSeries.getTimeSeriesBetweenDates(argBeginDate, argEndDate) ⇒ <code>Array</code>
Takes as parameters two dates (in millisecond or a date string in a valid format, preferably "year-month-day hours-minutes-seconds" for example : 2018-10-25 16:26:30 )
and returns a Array of all timeSeries between the two dates

**Kind**: instance method of [<code>TimeSeries</code>](#TimeSeries)  
**Returns**: <code>Array</code> - Array of all timeSeries between argBeginDate and argEndDate  

| Param | Type |
| --- | --- |
| argBeginDate | <code>Date</code> | 
| argEndDate | <code>Date</code> | 

<a name="TimeSeries+getDateValue"></a>

### timeSeries.getDateValue(argDate) ⇒ <code>Object</code>
It Takes a date as params and return the data corresponding to this date,
it returns an empty object if no data is associated with the date

**Kind**: instance method of [<code>TimeSeries</code>](#TimeSeries)  
**Returns**: <code>Object</code> - returns an object that contains the date and data corresponding to argDate  

| Param | Type |
| --- | --- |
| argDate | <code>Date</code> | 

<a name="TimeSeries+removeDate"></a>

### timeSeries.removeDate(dateToRemove) ⇒ <code>Object</code> \| <code>undefined</code>
It takes a date as a params and remove and returns the data corresponding to this date

**Kind**: instance method of [<code>TimeSeries</code>](#TimeSeries)  
**Returns**: <code>Object</code> \| <code>undefined</code> - returns the data corresponding to this date, returns undefined if no data found.  

| Param | Type |
| --- | --- |
| dateToRemove | <code>Date</code> | 

<a name="TimeSeries+archiveDate"></a>

### timeSeries.archiveDate(beginDate, [endDate])
this function takes as parameters two date (one optional),
if both dates are given it archives all date between both (they even included)
else it archives the date given

**Kind**: instance method of [<code>TimeSeries</code>](#TimeSeries)  

| Param | Type |
| --- | --- |
| beginDate | <code>Date</code> | 
| [endDate] | <code>Date</code> | 

<a name="TimeSeries+getDateArchived"></a>

### timeSeries.getDateArchived() ⇒ <code>Promise</code>
this function allows to get all data archived, it returns a Promise

**Kind**: instance method of [<code>TimeSeries</code>](#TimeSeries)  
**Returns**: <code>Promise</code> - a promise of all archived data  
<a name="TimeSeries+archiveDataPerDay"></a>

### timeSeries.archiveDataPerDay()
this function allows to archive the data of the timeSeries, by changing the attribute archiveTime you change the archiving frequency.

**Kind**: instance method of [<code>TimeSeries</code>](#TimeSeries)  
<a name="TimeSeries.TimeSeries"></a>

### TimeSeries.TimeSeries
**Kind**: static class of [<code>TimeSeries</code>](#TimeSeries)  
<a name="new_TimeSeries.TimeSeries_new"></a>

#### new TimeSeries([_name], [archiveTime], [frequency], [data])
Creates an instance of TimeSeries.
It takes as parameters the name of the timeSeries (_name) a string,
the number of hours during which the data is saved, after that the data is archived
a frequency (frequency) of adding data in seconds.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [_name] | <code>string</code> | <code>&quot;\&quot;TimeSeries\&quot;&quot;</code> |  |
| [archiveTime] | <code>number</code> | <code>24</code> | in hours |
| [frequency] | <code>number</code> | <code>5</code> | in second |
| [data] | <code>Lst</code> | <code>new Lst()</code> |  |

