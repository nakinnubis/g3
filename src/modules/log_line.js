
// Attach line creation function to g3.log
g3.log.line = function(plot, data){
  return new line(plot, data);
};

// Constructor
// Only set variables that are set by items passed in, otherwise set using prototype
var line = function line(plot, data){
	if(!data || !$.isArray(data)){ return 'Param: data is missing, An array required'; }
	if(!plot){ return 'Param: plot is missing, a div to attach the svg is required'; }
  this._data = data;
  this._plot = plot;
  this._xMin = 0;
  this._yMin = 0;
  return this;
};

// Set remaining variables
line.prototype._xInt = 1;
line.prototype._yInt = 1;
line.prototype._color = "blue";
line.prototype._duration = 5;
line.prototype._strokeWidth = 0.25;

// Setters 
line.prototype.duration = function(duration){
	if(duration === undefined){ return this._duration; }
	this._duration = duration;
	return this;
};

line.prototype.xTrans = function(xMin){
	if(xMin === undefined){ return this._xMin; }
	this._xMin = xMin;
	return this;
};

line.prototype.xMult = function(xInt){
	if(xInt === undefined){ return this._xInt; }
	this._xInt = xInt;
	return this;
};

line.prototype.yTrans = function(yMin){
	if(yMin === undefined){ return this._yMin; }
	this._yMin = yMin;
	return this;
};

line.prototype.yMult = function(yInt){
	if(yInt === undefined){ return this._yInt; }
	this._yInt = yInt;
	return this;
};

line.prototype.color = function(color){
	if(color === undefined){ return this._color; }
	this._color = color;
	return this;
};

line.prototype.strokeWidth = function(strokeWidth){
	if(strokeWidth === undefined){ return this._strokeWidth; }
	this._strokeWidth = strokeWidth;
	return this;
};

line.prototype.draw = function(){
	var lineFunc = this.lineFunc();
	this._svg = this._plot._svg.append('path')
		.datum(this._data)
		.attr('d', lineFunc)
		.attr('stroke', this._color)
		.attr('stroke-width', this._strokeWidth)
		.attr('fill', 'none');
	return this;
};

line.prototype.reDraw = function(data){
	var lineFunc = this.lineFunc();
	this._svg.transition()
		.duration(this._duration)
		.attr('d', lineFunc(data))
		.ease('linear');
	return this;
};

line.prototype.lineFunc = function(){
	var plot = this._plot,
			yInt = this._yInt,
			yMin = this._yMin,
			xInt = this._xInt,
			xMin = this._xMin,
			interpolate = this._interpolate;

	return d3.svg.line()
		.x(function (d) {
			return plot._xScale(d * xInt + xMin);
		})
		.y(function (d, i){
			return plot._yScale(i * yInt + yMin);
		})
		.interpolate(interpolate);
};

// var sorted = data.sort(function(a, b) {
//   return a - b;
// });

// var focus = plot.svg.append("g")
//     .attr("class", "focus")
//     .style("display", "none");

// focus.append("circle")
//     .attr("r", 4.5);

// focus.append("text")
//     .attr("x", 9)
//     .attr("dy", ".35em");
//     var bisectDate = d3.bisector(function(d) { return d; }).left;
// plot.svg.append("rect")
//     .attr("class", "overlay")
//     .attr("width", plot.width)
//     .attr("height", plot.height)
//     .on("mouseover", function() { focus.style("display", null); })
//     .on("mouseout", function() { focus.style("display", "none"); })
//     .on("mousemove", mousemove);

// function mousemove() {
//   var x0 = plot.xScale.invert(d3.mouse(this)[0]),
//       i = bisectDate(data, x0, 1),
//       d0 = data[i - 1],
//       d1 = data[i],
//       d = x0 - d0 > d1 - x0 ? d1 : d0;
//   focus.attr("transform", "translate(" + plot.xScale(d) + "," + plot.yScale(d) + ")");
//   focus.select("text").text(d);
// };