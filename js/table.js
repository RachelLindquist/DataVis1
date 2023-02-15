class Table{
    constructor(_config, _data, _name, _columns) {
        // Configuration object with defaults
        this.config = {
          parentElement: _config.parentElement,
          containerWidth: _config.containerWidth || 500,
          containerHeight: _config.containerHeight || 300,
          margin: _config.margin || {top: 50, bottom: 50, right: 50, left: 50 },
        }
        this.data = _data;
        this.na = _name;
        this.columns = _columns;
        this.initVis();
    
      }

    initVis(){
      
    }
}