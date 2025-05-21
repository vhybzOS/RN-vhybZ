export class ControllToken {
  private _isCancelled = false;
  cancel() {
    this._isCancelled = true;
  }
  get isCancelled() {
    return this._isCancelled;
  }
}
