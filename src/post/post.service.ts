import { assignMetadata, BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostDto } from './dto/post.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Post } from './entities/post.entity';
import { take } from 'rxjs';
import { title } from 'process';
import * as dayjs from 'dayjs';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(postDto: PostDto, userId: string): Promise<any> {
    const { title, content } = postDto;
    
    const writer: PostDto = {
      title,
      content,
      writer: userId
    }
    await this.postRepository.save(writer);
    return Object.assign({"message": "write success"})
  }

  async getAllPosts(page: number, offset: number): Promise<any> {
    if(page <= 0) {
      let page = 1;
    }

    const list = await this.postRepository
    .createQueryBuilder('posts')
    .select([
      'posts.id',
      'posts.title',
      'posts.view',
      'posts.createdAt',
      'users.nickname',
    ])
    .limit(offset)
    .offset(offset*(page-1))
    .innerJoin('posts.writer', 'users')
    .where('posts.deletedAt IS NULL')
    .orderBy({ 'posts.createdAt': 'DESC'})
    .getManyAndCount();
    return Object.assign({"list": list})
  }

  async findPost(id: string): Promise<PostDto> {
    const post = await this.postRepository
    .query(`
    SELECT p.id, p.title, p.content, p.writer, p.view, p.createdAt, u.nickname
    FROM posts p
    INNER JOIN users u ON p.writer = u.id
    WHERE p.id = '${id}' AND p.deletedAt IS NULL
    `)
    return Object.assign({"post": post})
  }

  async update(id: string, userId: string, updatePost: PostDto) {
    const findPost = await this.postRepository.findOne({where: {id}});
    if(!findPost) {
      throw new BadRequestException('post not found');
    }

    if(findPost.writer !== userId) {
      throw new BadRequestException('not this post writer')
    }

    findPost.title = updatePost.title;
    findPost.content = updatePost.content;

    await this.postRepository.save(findPost)
    return Object.assign({"message": "update success"});
  }

  async remove(userId: string, postId: string) {
    const findPost = await this.postRepository.findOne({where: {id: postId}})
    if(findPost.writer !== userId) {
      throw new BadRequestException('not this post writer')
    }

    return await this.postRepository
    .createQueryBuilder()
    .softDelete()
    .where({id: postId})
    .execute()
  }
}
