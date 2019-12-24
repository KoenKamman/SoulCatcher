import fs from 'fs';
import Registry, { RegistryItem } from 'winreg';
import * as VDF from '@node-steam/vdf';

export function getSteamPath(): Promise<string> {
  return new Promise((resolve, reject) => {
    const steamPathRegKey = new Registry({
      hive: Registry.HKCU,
      key: '\\Software\\Valve\\Steam'
    });
    steamPathRegKey.values((err, items: RegistryItem[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(items.find((item) => item.name === 'SteamPath')?.value);
      }
    });
  });
}

export function getLibraryFolders(steamPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(steamPath + '/steamapps/libraryfolders.vdf', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const parsedVdf = VDF.parse(data.toString());
        resolve(parsedVdf.LibraryFolders);
      }
    });
  });
}

export async function getSteamLibraryPaths(steamPath: string): Promise<string[]> {
  const steamLibraryPaths: string[] = [];
  const libraryFolders = await getLibraryFolders(steamPath);
  for (const key in libraryFolders) {
    if (libraryFolders.hasOwnProperty(key)) {
      if (!isNaN(Number(key))) {
        steamLibraryPaths.push(libraryFolders[key].replace(/\\\\/g, '/'));
      }
    }
  }
  return steamLibraryPaths;
}

export async function getDotaPath(): Promise<string | undefined> {
  const steamPath = await getSteamPath();
  const steamLibraryPaths = await getSteamLibraryPaths(steamPath);
  let dotaPath: string | undefined;
  steamLibraryPaths.forEach((libPath: string) => {
    const fullPath = libPath + '/steamapps/common/dota 2 beta';
    if (fs.existsSync(fullPath)) {
      dotaPath = fullPath;
    }
  });
  return dotaPath;
}
