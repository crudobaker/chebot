import ksuid from "ksuid";

/** The IdManager generates and parses application identifiers.
 * The implementation uses KSUID global unique identifiers.
 */
const IdManager = {
  /** Generates a random identifier.
   *
   * KSUID ids are sortable by date, you can optionally specify a timestamp for the id.
   *
   * @param timestamp {number} Timestamp for the id, default is the current time.
   * @returns {string}
   */
  randomId(timestamp = new Date().getTime()) {
    return ksuid.randomSync(timestamp).string;
  },
};

export default IdManager;
