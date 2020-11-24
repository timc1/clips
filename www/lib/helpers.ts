export function noop() {
  return Object.freeze({});
}

export function isSSR() {
  return typeof window === "undefined";
}

export function anyHover() {
  return "matchMedia" in window && window.matchMedia("(any-hover)").matches;
}

export function stopEventPropagation(event: any) {
  event.preventDefault();
  event.stopPropagation();
}

export function chunkifyLargeJSONArray(array, maxBytes = 10240): Array<any[]> {
  const size = new Blob([JSON.stringify(array)]).size;
  // Super large payload – split it up
  if (size > maxBytes) {
    const numOfChunks = Math.ceil(size / maxBytes);
    const chunkSize = Math.floor(array.length / numOfChunks);

    const chunks = Array.from(Array(numOfChunks)).map((_, index) => {
      // On the last iteration, just slice off what is left from plots.current
      if (index === numOfChunks - 1) {
        return array.slice(array.length - chunkSize);
      }

      return array.slice((chunkSize - 1) * index, chunkSize * (index + 1));
    });

    return chunks;
  }

  return [array];
}

export function swallowEvent(
  event: React.KeyboardEvent<any> | React.MouseEvent<any>
) {
  event.stopPropagation();
}

export function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + ampm;
  return strTime;
}
