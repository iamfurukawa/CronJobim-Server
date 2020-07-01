import { Entity, Column, PrimaryGeneratedColumn, Long, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"

import User from "./User"
import Reminder from "./Reminder"

@Entity()
class Webhook {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 64
    })
    alias: string

    @Column({
        length: 255
    })
    webhook: string

    @OneToMany(type => Reminder, reminder => reminder.webhook)
    reminders: Reminder[]

    @ManyToOne(type => User, user => user.webhooks, { onDelete:'CASCADE' })
    owner: User  

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date
}

export default Webhook