import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'
import { VercelBlobClientUploadHandler as VercelBlobClientUploadHandler_16c82c5e25f430251a3e3ba57219ff4e } from '@payloadcms/storage-vercel-blob/client'
import { default as default_mosh_logo } from '../../../payload/components/Logo'
import { default as default_mosh_icon } from '../../../payload/components/Icon'
import { default as default_mosh_import } from '../../../payload/components/ImportDefaults'

/** @type import('payload').ImportMap */
export const importMap = {
  '@payloadcms/next/rsc#CollectionCards': CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1,
  '@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler':
    VercelBlobClientUploadHandler_16c82c5e25f430251a3e3ba57219ff4e,
  './payload/components/Logo#default': default_mosh_logo,
  './payload/components/Icon#default': default_mosh_icon,
  './payload/components/ImportDefaults#default': default_mosh_import,
}
