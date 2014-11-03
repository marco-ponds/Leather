Class("Bliss", {
		//constructor
		Bliss : function() {

			this.frequency_table = {
				"1" : {
					a : 32.7032,
						w : 34.6478,
					s : 36.7081,
						e : 38.8909,
					d : 41.2034,
					f : 43.6535,
						t : 46.2493,
					g : 48.9994,
						y : 51.9131,
					h : 55.0000,
						u : 58.2705,
					j : 58.2705
				},
				"2" : {
					a : 65.4064,
						w : 69.2957,
					s : 73.4162,
						e : 77.7817,
					d : 82.4069,
					f : 87.3071,
						t : 92.4986,
					g : 97.9989,
						y : 103.826,
					h : 110.000,
						u : 116.541,
					j : 123.471
				},
				"3" : {
					a : 130.813,
						w : 138.591,
					s : 146.832,
						e : 155.563,
					d : 164.814,
					f : 174.614,
						t : 184.997,
					g : 195.998,
						y : 207.652,
					h : 220.000,
						u : 233.082,
					j : 246.942
				},
				"4" : {
					a : 261.626,
						w : 277.183,
					s : 293.665,
						e : 311.127,
					d : 329.628,
					f : 349.228,
						t : 369.994,
					g : 391.995,
						y : 415.305,
					h : 440.000,
						u : 466.164,
					j : 493.883
				},
				"5" : {
					a : 523.251,
						w : 554.365,
					s : 587.330,
						e : 622.254,
					d : 659.255,
					f : 698.456,
						t : 739.989,
					g : 783.991,
						y : 830.609,
					h : 880.000,
						u : 932.328,
					j : 987.767
				},
				"6" : {
					a : 1046.50,
						w : 1108.73,
					s : 1174.66,
						e : 1244.51,
					d : 1318.51,
					f : 1396.91,
						t : 1479.98,
					g : 1567.98,
						y : 1661.22,
					h : 1760.00,
						u : 1864.66,
					j : 1975.53
				},
				"7" : {
					a : 2093.00,
						w : 2217.46,
					s : 2349.32,
						e : 2489.02,
					d : 2637.02,
					f : 2793.83,
						t : 2959.96,
					g : 3135.96,
						y : 3322.44,
					h : 3520.00,
						u : 3729.31,
					j : 3951.07
				}

			};

			this.types = {
				"1" : "keyboard",
				"2" : "Leap Motion"
			};

			this.context = undefined,

			this.oscillator = undefined,
			this.gain = undefined,
			this.analyser = undefined,

			this.detune = 0;
			this.delayFactor = 0.02,

			this.frequency = undefined,
			this.volume = 1,
			this.octave = 4,
			this.wave = 0,
			//first input type is 1.
			this.current_type = "1";

			//creating audio context
			if (!window.webkitAudioContext) {
				//we must show an alert message if browser
				//doesn't support webkit audio context.
				log.e("Error, we don't have webkit audio");
				console.log("we don't have webkit audio");
				return;
			}
			console.log("HELL YEAH. HAVE FUN");
			this.context = new webkitAudioContext();
			//create main gain and connect to destination
			this.gain = this.context.createGain();
			this.gain.connect(this.context.destination);
		}
});


//SOUND CLASS

Class("Sound", {

	Sound : function(bliss, key) {
		if ( bliss.context) {
			//console.log(key);
			this.bliss = bliss;
			var freq = bliss.frequency_table[bliss.octave][""+key];
			this.oscillator = bliss.context.createOscillator();
			this.oscillator.type = this.bliss.wave;
			this.oscillator.frequency.value = freq;
			this.oscillator.noteOn(0);

			this.oscillator.detune.value = this.bliss.detune;

			this.gain = bliss.context.createGain();
			this.gain.gain.value = this.bliss.volume;

			this.oscillator.connect(this.gain);
			//we must connect to general gain
			this.gain.connect(this.bliss.gain);
			//bliss gain is already connected to our speaker
			//this.gain.connect(bliss.context.destination);

			this.oscillator.k = key;
			//fadeout function
		}
	},

	fadeOut : function() {
		var self = this;
		var a = function() {
			self.gain.gain.value = self.gain.gain.value - self.bliss.delayFactor;
			if (self.gain.gain.value > 0.01) {
				setTimeout(a,5);
			}
			else {
				self.oscillator.noteOff(0);
				self.oscillator.disconnect();
			}
		}
		a();
	}
});
	
