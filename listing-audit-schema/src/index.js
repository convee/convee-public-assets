import checks from '../checks.json' with { type: 'json' };

export const auditChecks = Object.freeze(checks.map((check) => Object.freeze({ ...check })));

export function getChecks(area) {
  return area ? auditChecks.filter((check) => check.area === area) : [...auditChecks];
}

export function groupChecks() {
  return auditChecks.reduce((groups, check) => {
    (groups[check.area] ||= []).push(check);
    return groups;
  }, {});
}
