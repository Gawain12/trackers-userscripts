import { Resolution } from "../trackers/tracker";

export const parseSize = (text: string): number | null => {
  let size: number | null = null;
  text = text.replace("GiB", "GB").replace("MiB", "MB");
  if (text.includes("GB")) {
    size = parseFloat(text.split("GB")[0]) * 1024; // MB
  } else if (text.includes("MB")) size = parseFloat(text.split("MB")[0]);
  return size;
};

export const parseImdbIdFromLink = (element: HTMLElement) => {
  const imdbLink: HTMLAnchorElement | null = element.querySelector(
    '[href*="imdb.com/title/tt"]'
  );
  if (imdbLink) {
    return (
      "tt" +
      imdbLink.href
        .split("/tt")[1]
        .replace("/", "")
        .trim()
        .replaceAll(/\?.+/g, "")
    );
  }
  return null;
};

export const parseImdbId = (text: string) => {
  if (!text) return null;
  const results = text.match(/(tt\d+)/);
  if (!results) {
    return null;
  }
  return results[0];
};

export const parseResolution = (text: string): Resolution | undefined => {
  const resolutionsAndAliases: Record<Resolution, string[]> = {
    SD: ["sd", "pal", "ntsc"],
    HD: ["720p", "hd"],
    FHD: ["1080p", "fhd", "full_hd"],
    UHD: ["2160p", "uhd", "4k"],
  };
  if (!text) return undefined;
  for (let resolution in resolutionsAndAliases) {
    let aliases = resolutionsAndAliases[resolution as keyof typeof Resolution];
    for (let alias of aliases) {
      if (text.includes(alias)) {
        return resolution as Resolution;
      }
    }
  }
  const regex = /\b(\d{3,4})x(\d{3,4})\b/;
  const match = text.match(regex);

  if (match) {
    const height = parseInt(match[2]);
    if (height < 720) return Resolution.SD;
    if (height < 1080) return Resolution.HD;
    if (height < 2160) return Resolution.FHD;
    return Resolution.UHD;
  }
  return undefined;
};

export const parseYearAndTitleFromReleaseName = (releaseName: string) => {
  const regex = /^(.+?)\.(\d{4})\./;
  const match = releaseName.match(regex);

  if (match) {
    const title = match[1].replace(/\./g, " ").trim();
    const year = parseInt(match[2], 10);
    return { year, title };
  }
  return { year: undefined, title: undefined };
};

export const parseCodec = (title: string) => {
  title = title.toLowerCase();
  const codecAndAlias: Record<string, string[]> = {
    x264: ["x264", "h264", "h.264", "h 264"],
    x265: ["x265", "h265", "h.265", "h 265", "hevc"],
  };
  for (let codec in codecAndAlias) {
    let aliases = codecAndAlias[codec];
    for (let alias of aliases) {
      if (title.includes(alias)) {
        return codec;
      }
    }
  }

  return null;
};

export const parseTags = (title: string) => {
  const tags: string[] = [];
  if (!title) return tags
  if (title.toLowerCase().includes("remux")) tags.push("Remux");
  if (title.replaceAll(new RegExp("HDRip", "gi"), "").includes("HDR"))
    tags.push("HDR");
  if (title.includes("DV")) tags.push("DV");

  return tags;
};

export const parseYearAndTitle = (title: string) => {
  const regex = /^(.*?)\s+(\d{4})\s+(.*)$/;
  const match = title.match(regex);

  if (match) {
    const title = match[1].trim();
    const year = parseInt(match[2], 10);

    return { title, year };
  }

  return { title: undefined, year: undefined };
};