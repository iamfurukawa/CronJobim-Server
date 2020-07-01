import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm"
import bcrypt from 'bcryptjs'

import Webhook from "./Webhook"
import Reminder from "./Reminder"

@Entity()
class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 64
    })
    username: string

    @Column({
        length: 64
    })
    password: string

    @Column({
        length: 64,
        unique: true
    })
    email: string

    @OneToMany(type => Webhook, webhook => webhook.owner)
    webhooks: Webhook[]

    @ManyToMany(type => Reminder, reminder => reminder.access)
    subscribed: Reminder[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date

   @BeforeInsert()
   async hashPassword() {
      this.password = await bcrypt.hash(this.password, 8)
   }
}

export default User