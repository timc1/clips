type Cache = {
  [k: string]: string;
};

function cache() {
  const _cache: Cache = {};

  const cache = {
    get: (key: string) => {
      const cachedUrl = _cache[key];

      if (cachedUrl) {
        try {
          // grab created time from s3 url. why is the param Expires? 🤔
          const parsedUrl = new URL(cachedUrl);
          const created = Number(parsedUrl.searchParams.get("Expires"));

          // calculate the expiration time (1 hour in our case) converted to unix time:
          // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-creating-signed-url-canned-policy.html
          const dt = new Date(created);
          dt.setTime(dt.getTime() + 1);
          const expires = parseInt((new Date().getTime() / 1000).toFixed(0));

          const expired = expires - created > 0;
          if (expired) {
            delete _cache[key];
            return undefined;
          }

          return cachedUrl;
        } catch {
          delete _cache[key];
          return undefined;
        }
      }

      return undefined;
    },
    set: (key: string, value: string) => (_cache[key] = value),
  };

  return cache;
}

export default cache();
