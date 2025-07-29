import request from "@/api/BaseRequest"

export function getMusicCatalogList(queryParam) {
    return request({
        method: 'post',
        url: '/admin/musicCatalog/getMusicCatalogList',
        data: {
            ...queryParam
        }
    })
}

export function saveMusicCatalog(saveParam) {
    return request({
        method: 'post',
        url: '/admin/musicCatalog/saveMusicCatalog',
        data: {
            ...saveParam
        }
    })
}

export function updateMusicCatalog(updateParam) {
    return request({
        method: 'post',
        url: '/admin/musicCatalog/updateMusicCatalog',
        data: {
            ...updateParam
        }
    })
}