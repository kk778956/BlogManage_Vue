import request from "@/api/BaseRequest"

export function getMusicTable(queryParam) {
    return request({
        method: 'post',
        url: '/admin/music/getMusicTable',
        data: {
            ...queryParam
        }
    })
}

export function saveMusic(saveParam) {
    return request({
        method: 'post',
        url: '/admin/music/saveMusic',
        data: {
            ...saveParam
        }
    })
}

export function updateMusic(updateParam) {
    return request({
        method: 'post',
        url: '/admin/music/updateMusic',
        data: {
            ...updateParam
        }
    })
}

export function deleteMusic(deleteParam) {
    return request({
        method: 'post',
        url: '/admin/music/deleteMusic',
        data: {
            ...deleteParam
        }
    })
}