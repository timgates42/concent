import util from '../support/util';
import pickOneRef from '../core/ref/pick-one-ref';
export default function (event, option) {
  try {
    var ref = pickOneRef();
    ref.$$off(event, option);
  } catch (err) {
    if (option.throwError) throw err;else util.justWarning(err.message);
  }
}