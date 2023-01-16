import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, Res, HttpCode } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { Response } from 'express';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService) {}

  @Post('/register')
  @UseGuards(AuthGuard)
  async createPost(@GetUser() userId: string, @Body() postDto: PostDto): Promise<any> {
    return await this.postService.createPost(postDto, userId);
  }

  @Get('/list')
  async postList(
    @Query('page') page: number,
    @Query('offset') offset: number,
    ): Promise<any> {
    return await this.postService.getAllPosts(page, offset);
  }

  @Get()
  async findOne(@Res() res: Response, @Query('id') id: string): Promise<any> {
    const detailPost = await this.postService.findPost(id);
    return res.json({information: detailPost})
  }

  @Patch('/update')
  @UseGuards(AuthGuard)
  async update(@GetUser() userId: string, @Query('id') postId: string, @Body() updatePost: PostDto) {
    return await this.postService.update(postId,userId, updatePost);
  }

  @Delete('/delete')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  remove(@GetUser() userId: string, @Query('id') postId: string): Promise<any> {
    return this.postService.remove(userId, postId);
  }
}
