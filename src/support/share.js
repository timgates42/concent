import ccContext from '../cc-context';

export function strictWarning(err) {
  if (ccContext.isStrict) {
    throw err;
  }
  console.error(' ------------ CC WARNING ------------');
  if (err instanceof Error) console.error(err.message);
  else console.error(err)
}