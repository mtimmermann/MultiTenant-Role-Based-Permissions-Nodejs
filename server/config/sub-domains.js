
const SubDomains = {

  list:
  [
    'companyabc',
    'companyxyz',
    'company123'
  ],

  /**
   * Map a subdomain from an array list of subdomains from req.subdomains
   *
   * @param   {array}  subdomains A list of subdomains
   * @returns {string} The matched subdomain, null if not found
   */
  match: (subdomains) => {
    const list = SubDomains.list;
    if (subdomains.length === 1) {
      const idx = list.indexOf(subdomains[0]);
      return idx > -1 ? list[idx] : null;
    }
    if (subdomains.length === 0) {
      return null;
    } else if (subdomains.length > 1) {
      subdomains = subdomains.reverse();
      const idx = list.indexOf(subdomains[0]);
      return idx > -1 ? list[idx] : null;
    }

  }

};

module.exports = SubDomains;
