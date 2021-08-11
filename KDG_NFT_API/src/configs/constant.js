'use strict';

const config = require('./index');

const env = config.ETHEREUM_NETWORK.toLowerCase();

const contracts = {
    testnet: {
        collections: {
            kinglive: {
                address: '0x5e689430C8C57653c2f3a3d450CeAb5D7824EC95'
            }
        }
    },
    mainnet: {
        collections: {
            kinglive: {
                address: '0xb932a70A57673d89f4acfFBE830E8ed7f75Fb9e0'
            }
        }
    }
};

module.exports = {
    whitelist_types: {
        group: 1,
        collab: 2
    },
    contracts: contracts[env],
    opensea: {
        api_key: '2f5080f5f0bc4d0baad5239c94c044ec',
        collections: {
            autoglyphs: {
                address: '0xd4e4078ca3495de5b1d4db434bebc5a986197782'
            },
            blanknft: {
                address: '0x01BDBa36E0b921A4c69D1C33A76521a2356B7E4d'
            },
            cryptopunks: {
                address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
            },
            knownoriginv2: {
                address: '0xfbeef911dc5821886e1dda71586d90ed28174b7d'
            },
            makersplacev2: {
                address: '0x2d9e5de7d36f3830c010a28b29b3bdf5ca73198e'
            },
            makersplacev3: {
                address: '0x2a46f2ffd99e19a89476e2f62270e0a35bbf0756'
            },
            wrappedpunks: {
                address: '0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6'
            },
            superrarev1: {
                address: '0x41A322b28D0fF354040e2CbC676F0320d8c8850d'
            },
            superrarev2: {
                address: '0xb932a70A57673d89f4acfFBE830E8ed7f75Fb9e0'
            }
        }
    },
    STRING_SOCKET: '8bL4a3Ymuk41wImgs85570NA9ro373P2p1SLTtoM2GM2dVHeVRA26CZNGbu9bS607hiXcrA6fgADMZKn9eDEbn8tnUNbwpxa8RnKD23C0fayV4tEETngy3lDJrUoM9ddPkbYueFaXA6DjoMvZ2G3xK0TH37V4kSCCCn0xFPzlxmPYvWLLLJJObSI2X4csarfEXilqxj8',
    STRING_API: 'YSDyFQAESEf5It5wMmZ7cJO3P33lzGVvjfQL7SaOW0jFtkuh2h5ywPqU0nCz88XZhSni8AYldpT6d0Qr9vz1sVDCAwNva9lKbzLa3FXWFFzguD1CGfDyo5K2sTF8KOQB6cCN1zvc0QEUg6ZP11mxKd4eJNvWng3ZSSyf9dbBEtlLVAtGqJzCWzyEvKx8AePlsOeGJ4PL',
    socket_server: 'https://ws.kingdomgame.org',
    jwt_secret: 'lRNnoVulI0SMRXY30DN84lb0415gXOwHXqOqhLaplwodPnATPZYLe3TATY7viq6GIv5KmiUP2OpNKQT41EheS7TaWKNNN2TaUy0XJG9W7EapVF2qWDdf419whTiAeBe3dQdwITJMf9hFMcHi6DplrV7v6luLHG8kFwNa9p47kClIVhrbA6EqthmdNkgPElh6M7Ulmv30',
    refresh_secret: 'dUw4ZaWlYMhYMQhsJToNuiskEHeiK5cieCZKWHz02TRy2VdVA1O0ESIJeiii46jx36Jzo2eFIPD3sR7FNKwbWqkdHb9pOGIdm9qV34Xv4loqP9ew6iZXzxEaFsqPV4p2uvvLKL61OlTyWU1k3LCgDxwao0ovJtmTJYjbmmHApDY7eDJOrmw0zId6cdfENw9Zvt6DXW5O',
    mns_config: {
      logType: 0,
      rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
      },
      http: {
        port: 8000,
        allow_origin: '*',
        mediaroot: '/mnt/disk_stream'
      },
      trans: {
        ffmpeg: '/root/code/KDG_STREAM/ffmpeg/ffmpeg',
        tasks: [
          {
            app: 'live',
            hls: true,
            hlsFlags: '[hls_time=1:hls_list_size=0]',
          },
          {
            app: 'live',
            mp4: true,
            mp4Flags: '[movflags=faststart]',
          },
        ]
      }
    },
};
