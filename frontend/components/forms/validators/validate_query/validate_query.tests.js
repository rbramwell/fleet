import expect from 'expect';

import validateQuery from './index';

const malformedQueries = [
  'this is not a thing',
  'SELECT * FROM foo bar baz',
];
const validQueries = [
  'SELECT * FROM users',
  'select i.*, p.resident_size, p.user_time, p.system_time, time.minutes as ' +
    'counter from osquery_info i, processes p, time where p.pid = i.pid',
  'select feeds.*, p2.value as sparkle_version from (select a.name as ' +
    'app_name, a.path as app_path, a.bundle_identifier as bundle_id, ' +
    'p.value as feed_url from (select name, path, bundle_identifier from ' +
    "apps) a, preferences p where p.path = a.path || '/Contents/Info.plist' " +
    "and p.key = 'SUFeedURL' and feed_url like 'http://%') feeds left outer " +
    "join preferences p2 on p2.path = app_path || '/Info.plist' where " +
    "(p2.key = 'CFBundleShortVersionString' OR coalesce(p2.key, '') = '')",
];
const createQuery = 'CREATE TABLE users (LastName varchar(255))';
const insertQuery = 'INSERT INTO users (name) values ("Mike")';

describe('validateQuery', () => {
  it('rejects malformed queries', () => {
    for (const query of malformedQueries) {
      const { error, valid } = validateQuery(query);

      expect(valid).toEqual(false);
      expect(error).toMatch(/Syntax error found near .+/);
    }
  });

  it('rejects blank queries', () => {
    const { error, valid } = validateQuery();

    expect(valid).toEqual(false);
    expect(error).toEqual('Query text must be present');
  });

  it('rejects create queries', () => {
    const { error, valid } = validateQuery(createQuery);
    expect(valid).toEqual(false);
    expect(error).toEqual('Cannot INSERT or CREATE in osquery queries');
  });

  it('rejects insert queries', () => {
    const { error, valid } = validateQuery(insertQuery);
    expect(valid).toEqual(false);
    expect(error).toEqual('Cannot INSERT or CREATE in osquery queries');
  });

  it('accepts valid queries', () => {
    for (const query of validQueries) {
      const { error, valid } = validateQuery(query);
      expect(valid).toEqual(true, query);
      expect(error).toNotExist();
    }
  });
});
