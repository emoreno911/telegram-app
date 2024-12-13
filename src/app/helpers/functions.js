export async function getApiRadio(payload = {}) {
  try {
    const res = await fetch(`/api/radio/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return { data: null };
  }
}

export async function getApiRadioList(payload = {}) {
  try {
    const res = await fetch(`/api/radio_list/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return { data: null };
  }
}

export async function getApiTrackList(payload = {}) {
  try {
    const res = await fetch(`/api/track_list/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return { data: null };
  }
}

export const getSongs = async (category, numberOfSongs) => {
  try {
    const { data } = await getApiTrackList(category);
    let songList = [];

    const addRandomSongTilN = (arr1, arr2, n) => {
      const possibleTrack = data[getRandomInt(arr2.length - 1)];

      const trackAlreadyThere =
        arr1.length > 0 &&
        arr1.findIndex((track) => track.id === possibleTrack.id) != -1;

      if (!trackAlreadyThere) {
        arr1.push(possibleTrack);
      }

      if (arr1.length === n) {
        return arr1;
      } else {
        addRandomSongTilN(arr1, arr2, n);
      }
    };

    addRandomSongTilN(songList, data, numberOfSongs);
    return { data: songList };
  } catch (error) {
    console.error(error);
    return { data: null };
  }
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
