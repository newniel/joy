(function(id,max,size,speed,gravity,wind){
  
    function Snow(){
      var that = this;
      
      this.canvas = document.getElementById(id);
      this.ctx = this.canvas.getContext("2d");
      this.frame = 0;
      this.delta = 0;
      this.frameTime = -1;
      
      this.flakes = {
        "canvas": document.createElement("canvas"),
        "data": []
      };
      this.flakes.ctx = this.flakes.canvas.getContext("2d");
      
      this.max = max;
      this.size = size;
      this.speed = speed;
      this.gravity = gravity;
      
      this.wind = new Wind();
      this.windSpeed = wind;
      
      this.pile = {
        "canvas": document.createElement("canvas"),
        "data": []
      };
      this.pile.ctx = this.pile.canvas.getContext("2d");
      
      this.resizeCanvas();
      window.addEventListener("resize",function(){
        that.resizeCanvas();
      });
      
      this.loop();
    }
    Snow.prototype = {
      //"constructor": Snow,
      
      "resizeCanvas": function(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight-25;
        this.pile.canvas.width = this.canvas.width;
        this.pile.canvas.height = this.canvas.height;
        this.flakes.canvas.width = this.canvas.width;
        this.flakes.canvas.height = this.canvas.height;
        this.wind.resize( this.canvas.width, this.canvas.height );
        this.drawTxt();
      },
      
      "loop": function(){
        var that = this;
        this.updateDelta();
        this.drawBg();
        
        if( this.flakes.data.length < this.max ){
          for(var i = 0 ; i < this.speed ; i++ ){
            this.flakes.data.push(new Flake({
              "posWidth": this.canvas.width,
              "size": this.size
            }));
          }
          //console.log(this.flakes.data.length);
        }
        
        this.flakes.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.flakes.ctx.fillStyle = "#fff";
        var newFlakes = [];
        this.flakes.data.forEach(function(flake,i){
          if( flake.update( that.delta, that.gravity, that.canvas.height, that.canvas.width, that.wind.data, that.pile.data, that.windSpeed ) ){
            newFlakes.push(flake);
            flake.draw( that.flakes.ctx, that.canvas.width, that.pile.data );
          } else {
            //add to pile
            flake.draw( that.pile.ctx, that.canvas.width );
            that.pile.data = that.pile.ctx.getImageData(0,0,that.canvas.width,that.canvas.height).data;
          }
        });
        this.flakes.data = newFlakes;
        
        this.ctx.drawImage( this.flakes.canvas, 0, 0 );
        this.ctx.drawImage( this.pile.canvas, 0, 0 );
        
        this.wind.update(this.frame);
        
        //show wind canvas
        //this.ctx.drawImage( this.wind.canvas, 0, 0 );
        
        //show fps
        if(this.frame%30==0)console.log(1000/this.delta);
        
        this.frame++;
        requestAnimationFrame(this.loop.bind(this));
      },
      
      "drawBg": function(){
        var grd = this.ctx.createLinearGradient(0,0,0,this.canvas.height);
        grd.addColorStop(0,"#bbb");
        grd.addColorStop(1,"#888");
        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
      },
      
      "drawTxt": function(){
        this.pile.ctx.fillStyle = "#fff";
        this.pile.ctx.font = "bold 50px century gothic";
        this.pile.ctx.textAlign = "center";
        //this.pile.ctx.fillText("SNOW!",this.canvas.width/2,this.canvas.height);
      },
      
      "updateDelta": function(){
        var t = new Date().getTime();
        if( this.frameTime > -1 ){
          this.delta = t - this.frameTime;
        }
        this.frameTime = t;
      },
      
    };
    
    function Flake(args){
      var size = args.size || 8;
      this.size = Math.round(Math.random()*size);
      if(this.size < 1) this.size = 1;
      
      var posWidth = args.posWidth || 600;
      this.position = {
        "x": Math.round(Math.random()*(posWidth*2))-(posWidth/2),
        "y": 0-(this.size/2)
      };
      
      this.opacity = (Math.random()*0.8)+0.2;
      
      
    }
    Flake.prototype = {
      constructor: Flake,
      
      "draw": function(ctx,width){
        if( this.position.x < 0-(this.size/2) || this.position.x > width+(this.size/2) ) return;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y,this.size,0,2*Math.PI);
        ctx.fill();
      },
      
      "update": function(delta,gravity,height,width,wind,imgData,windSpeed){
        
        var x = Math.floor(this.position.x),
            y = ((Math.floor(this.position.y))*width);
        if(x < 0) x = 1;
        if(x > width) x = width-1;
        
        if( imgData[((y+x)*4)+3] > 250 ){
          return false;
        }
        
        this.position.y += ((gravity/200)*(this.size/3))*delta;
        
        var windX = Math.round(wind[((y+x)*4)+0]) - Math.round(wind[((y+x)*4)+1]);
        if( !isNaN(windX) ){
          this.position.x +=  windX / (1000/windSpeed);
        }
        
        if(this.position.y >= height ){
          this.position.y = height;
          return false;
        }
        return true;
      },
      
    };
    
    function Wind(){
      this.force = 1;
      
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.data = [];
      
    }
    Wind.prototype = {
      constructor: Wind,
      
      "resize": function(w,h){
        this.canvas.width = w;
        this.canvas.height = h;
        this.reset(w,h);
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        this.draw();
      },
      
      "draw": function(){
        var that = this;
        this.ctx.fillStyle = "rgba(0,0,0,0.3)";
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        this.spots.forEach(function(spot,i){
          var grd = that.ctx.createRadialGradient(spot.x,spot.y,0,spot.x,spot.y,spot.size);
          if( spot.color >= 1 ){
            grd.addColorStop(0,"rgba(255,0,0,1)");
            grd.addColorStop(1,"rgba(0,0,0,0)");
          } else {
            grd.addColorStop(0,"rgba(0,255,0,1)");
            grd.addColorStop(1,"rgba(0,0,0,0)");
          }
          that.ctx.fillStyle = grd;
          that.ctx.beginPath();
          that.ctx.arc(spot.x,spot.y,spot.size,0,2*Math.PI);
          that.ctx.fill();
        });
        this.data = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height).data;
      },
      
      "update": function(frame){
        if(frame % 50 == 0){
          this.spots.forEach(function(spot,i){
            spot.x += (Math.random()*50) - 25;
            spot.y += (Math.random()*50) - 25;
            spot.size += (Math.random()*5) - 2.5;
          });
          this.draw();
        }
        if(frame % 10000 == 0){
          this.reset(this.canvas.width,this.canvas.height);
        }
      },
      
      "reset": function(w,h){
        this.spots = [];
        for( var i = 0 ; i < ((w*h)/50000) ; i++ ){
          this.spots.push({
            "x": Math.random()*w,
            "y": Math.random()*h,
            "size": (Math.random()*100)+150,
            "color": Math.floor(Math.random()*2)
          });
        }
      },
      
    };
    
    
    var snow = new Snow();
    
    
  })("c",1000,3,2,15,4);/*canvas id, max flakes, flake size, spawn speed, gravity, wind power*/