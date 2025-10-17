import uploadImageToCloudinary from '../config/Cloudinary.config.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponseHandler from '../utils/apiResponseHandler.js';
import ApiErrorHandler from '../utils/apiErrorHandler.js';
import prisma from '../../prisma/prismaClient.js';
import { cleanupFiles } from '../utils/cleanupFilesHandler.js';

export const saveProject = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const previewImageFile = req.files?.previewImage?.[0];
  const baseImageFile = req.files?.baseImage?.[0];

  const localFilePaths = [previewImageFile?.path, baseImageFile?.path].filter(Boolean);

  if (!previewImageFile) {
    throw new ApiErrorHandler(400, 'Preview image file is required.');
  }
  if (!baseImageFile) {
    throw new ApiErrorHandler(400, 'Base image file is required.');
  }
  if (!req.body.projectData) {
    if (localFilePaths.length > 0) await cleanupFiles(localFilePaths);
    throw new ApiErrorHandler(400, 'Project data is required.');
  }

  try {
    const [previewImageUrl, baseImageUrl] = await Promise.all([
      uploadImageToCloudinary(previewImageFile.path),
      uploadImageToCloudinary(baseImageFile.path)
    ]);

    if (!previewImageUrl) throw new ApiErrorHandler(500, 'Failed to upload preview image.');
    if (!baseImageUrl) throw new ApiErrorHandler(500, 'Failed to upload base image.');

    const projectData = JSON.parse(req.body.projectData);

    const transactionResult = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          userId: userId,
          baseImageSrc: baseImageUrl, 
          previewImageUrl: previewImageUrl,
          projectData: projectData, 
        },
      });

      const newGeneration = await tx.generation.create({
        data: {
          userId: userId,
          status: 'COMPLETED',
          userImageUrl: previewImageUrl, 
          projectId: newProject.id,
        },
      });

      await tx.generationAsset.create({
        data: {
          generationId: newGeneration.id,
          outputImageUrl: previewImageUrl,
        },
      });
      
      return { newProject, newGeneration };
    });

    new ApiResponseHandler(201, 'Project saved successfully', {
      projectId: transactionResult.newProject.id,
      generationId: transactionResult.newGeneration.id,
      previewImageUrl: transactionResult.newProject.previewImageUrl,
    }).send(res);

  } catch (error) {
    throw error; 
  } finally {
    if (localFilePaths.length > 0) await cleanupFiles(localFilePaths);
  }
});


export const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
            userId: userId, 
        },
    });

    if (!project) {
        throw new ApiErrorHandler(404, "Project not found or you don't have access.");
    }

    new ApiResponseHandler(200, "Project fetched successfully", project).send(res);
});


export const getMyProjects = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const projects = await prisma.project.findMany({ 
      where: { userId },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    new ApiResponseHandler(200, "Projects fetched", projects).send(res);
});