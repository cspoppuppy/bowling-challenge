class Bowling {
  constructor() {
    this.frames = [];
    this.gameStatus = true;
    this.totalScore = 0;
    this._newFrame();
  }

  roll(pins) {
    if (!this.gameStatus) return;
    this.currentFrame.roll(pins, this._isBonus);
    this.totalScore += pins;
    this._checkGameStatus();
    this._prepareNextRoll();
  }

  _prepareNextRoll() {
    if (this._isNextFrame) {
      this._adjustScoresForPastFrames();
      this._newFrame();
    }
    if (this._isBonus) {
      this.currentFrame.setPins();
    }
  }

  _adjustScoresForPastFrames() {
    this._adjustPrevFrameScore();
    this._adjustPrevPrevFrameScore();
  }

  _adjustPrevFrameScore() {
    if (this.frames.length < 2) return;
    let prevFrame = this.frames[this.frames.length - 2];
    let extraScore = 0;
    if (prevFrame.result === "Strike") {
      extraScore = (this.currentFrame.rolls.length < 2 ? this.currentFrame.score : (this.currentFrame.rolls[0] + this.currentFrame.rolls[1]));
    } else if (prevFrame.result === "Spare") {
      extraScore = this.currentFrame.rolls[0];
    }
    prevFrame.addScore(extraScore);
    this.totalScore += extraScore;
  }

  _adjustPrevPrevFrameScore() {
    if (this.frames.length < 3) return;

    let prevFrame = this.frames[this.frames.length - 2];
    let prevPrevFrame = this.frames[this.frames.length - 3];
    let extraScore = 0;
    if (prevFrame.result === "Strike" && prevPrevFrame.result === "Strike") {
      extraScore = this.currentFrame.rolls[0];
    }
    prevPrevFrame.addScore(extraScore);
    this.totalScore += extraScore;
  }

  _newFrame() {
    this.currentFrame = new Frame();
    this.frames.push(this.currentFrame);
  }

  get _isNextFrame() {
    if (this.frames.length === 0 || ((this.frames[this.frames.length-1].result !== "" || 
      this.frames[this.frames.length-1].rolls.length === 2) && this.frames.length <= 9)) {
      return true;
    } else {
    return false;
    }
  }

  get _isBonus() {
    if (this.frames.length === 10 && this.frames[this.frames.length-1].result !=="" ) {
      return true;
    } else {
      return false;
    }
  }

  _checkGameStatus() {
    if ((this.frames.length === 10 && this.frames[this.frames.length-1].result !=="" && this.frames[this.frames.length-1].rolls.length === 3) ||
    (this.frames.length === 10 && this.frames[this.frames.length-1].result ==="" && this.frames[this.frames.length-1].rolls.length === 2)) {
      this.gameStatus = false;
      this._adjustScoresForPastFrames();
    }
  }
}
